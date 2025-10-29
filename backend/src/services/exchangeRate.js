const axios = require('axios');
const logger = require('../utils/logger');
const { getRedisClient } = require('../config/redis');

const EXCHANGE_RATE_API_URL = 'https://v6.exchangerate-api.com/v6';
const API_KEY = process.env.EXCHANGE_RATE_API_KEY || 'demo-key';
const CACHE_TTL = 3600; // 1 hour cache

// Supported currencies
const SUPPORTED_CURRENCIES = ['NGN', 'USD', 'GBP', 'EUR'];

/**
 * Fetch exchange rates from ExchangeRate API
 */
const fetchExchangeRates = async (baseCurrency = 'USD') => {
  try {
    const url = `${EXCHANGE_RATE_API_URL}/${API_KEY}/latest/${baseCurrency}`;
    const response = await axios.get(url, { timeout: 5000 });

    if (response.data.result === 'success') {
      return {
        base: response.data.base_code,
        rates: response.data.conversion_rates,
        timestamp: response.data.time_last_update_unix
      };
    }

    throw new Error('Failed to fetch exchange rates');
  } catch (error) {
    logger.error('ExchangeRate API error:', error.message);
    throw error;
  }
};

/**
 * Get exchange rate with caching
 */
const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    // Check cache first
    const redis = getRedisClient();
    const cacheKey = `exchange_rate:${fromCurrency}:${toCurrency}`;
    
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.info('Exchange rate from cache', { fromCurrency, toCurrency });
        return JSON.parse(cached);
      }
    } catch (cacheError) {
      logger.warn('Cache read error, continuing without cache:', cacheError.message);
    }

    // Fetch from API
    logger.info('Fetching exchange rate from API', { fromCurrency, toCurrency });
    const data = await fetchExchangeRates(fromCurrency);

    if (!data.rates[toCurrency]) {
      throw new Error(`Exchange rate not available for ${toCurrency}`);
    }

    const rate = data.rates[toCurrency];
    const rateData = {
      from: fromCurrency,
      to: toCurrency,
      rate,
      timestamp: data.timestamp
    };

    // Cache the rate
    try {
      await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(rateData));
    } catch (cacheError) {
      logger.warn('Cache write error:', cacheError.message);
    }

    return rateData;
  } catch (error) {
    logger.error('Error getting exchange rate:', error);
    
    // Fallback to database rates if API fails
    return await getFallbackRate(fromCurrency, toCurrency);
  }
};

/**
 * Fallback to database rates if API fails
 */
const getFallbackRate = async (fromCurrency, toCurrency) => {
  try {
    const { query } = require('../config/database');
    
    const result = await query(
      `SELECT rate FROM exchange_rates 
       WHERE from_currency = $1 AND to_currency = $2 
       ORDER BY created_at DESC LIMIT 1`,
      [fromCurrency, toCurrency]
    );

    if (result.rows.length > 0) {
      logger.info('Using fallback rate from database', { fromCurrency, toCurrency });
      return {
        from: fromCurrency,
        to: toCurrency,
        rate: parseFloat(result.rows[0].rate),
        timestamp: Date.now() / 1000,
        fallback: true
      };
    }

    // Last resort: use hardcoded fallback rates
    const fallbackRates = {
      'NGN-USD': 0.00067,
      'USD-NGN': 1500,
      'NGN-GBP': 0.00053,
      'GBP-NGN': 1900,
      'NGN-EUR': 0.00061,
      'EUR-NGN': 1650,
      'USD-GBP': 0.79,
      'GBP-USD': 1.27,
      'USD-EUR': 0.91,
      'EUR-USD': 1.10,
      'GBP-EUR': 1.15,
      'EUR-GBP': 0.87
    };

    const rateKey = `${fromCurrency}-${toCurrency}`;
    if (fallbackRates[rateKey]) {
      logger.warn('Using hardcoded fallback rate', { fromCurrency, toCurrency });
      return {
        from: fromCurrency,
        to: toCurrency,
        rate: fallbackRates[rateKey],
        timestamp: Date.now() / 1000,
        fallback: true,
        hardcoded: true
      };
    }

    throw new Error('No exchange rate available');
  } catch (error) {
    logger.error('Fallback rate error:', error);
    throw new Error('Exchange rate service unavailable');
  }
};

/**
 * Convert amount from one currency to another
 */
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return {
      from: fromCurrency,
      to: toCurrency,
      fromAmount: amount,
      toAmount: amount,
      rate: 1
    };
  }

  const rateData = await getExchangeRate(fromCurrency, toCurrency);
  const convertedAmount = amount * rateData.rate;

  return {
    from: fromCurrency,
    to: toCurrency,
    fromAmount: amount,
    toAmount: convertedAmount,
    rate: rateData.rate,
    timestamp: rateData.timestamp,
    fallback: rateData.fallback
  };
};

/**
 * Get all current exchange rates for supported currencies
 */
const getAllRates = async () => {
  const rates = {};

  for (const from of SUPPORTED_CURRENCIES) {
    rates[from] = {};
    for (const to of SUPPORTED_CURRENCIES) {
      if (from !== to) {
        try {
          const rate = await getExchangeRate(from, to);
          rates[from][to] = rate.rate;
        } catch (error) {
          logger.error(`Failed to get rate ${from} to ${to}:`, error.message);
        }
      }
    }
  }

  return rates;
};

module.exports = {
  getExchangeRate,
  convertCurrency,
  getAllRates,
  SUPPORTED_CURRENCIES
};

