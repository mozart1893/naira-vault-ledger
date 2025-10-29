const express = require('express');
const router = express.Router();
const { getExchangeRate, getAllRates, convertCurrency } = require('../services/exchangeRate');
const logger = require('../utils/logger');

/**
 * @route   GET /api/currency/rates
 * @desc    Get current exchange rates for all supported currencies
 * @access  Public
 */
router.get('/rates', async (req, res) => {
  try {
    const rates = await getAllRates();
    
    res.status(200).json({
      success: true,
      data: {
        rates,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching rates:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch exchange rates'
      }
    });
  }
});

/**
 * @route   GET /api/currency/rate/:from/:to
 * @desc    Get exchange rate between two currencies
 * @access  Public
 */
router.get('/rate/:from/:to', async (req, res) => {
  try {
    const { from, to } = req.params;
    
    const rateData = await getExchangeRate(from, to);
    
    res.status(200).json({
      success: true,
      data: rateData
    });
  } catch (error) {
    logger.error('Error fetching exchange rate:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch exchange rate'
      }
    });
  }
});

/**
 * @route   POST /api/currency/convert
 * @desc    Preview currency conversion
 * @access  Public
 */
router.post('/convert', async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;
    
    if (!fromCurrency || !toCurrency || !amount) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'From currency, to currency, and amount are required'
        }
      });
    }

    const conversion = await convertCurrency(amount, fromCurrency, toCurrency);
    
    res.status(200).json({
      success: true,
      data: conversion
    });
  } catch (error) {
    logger.error('Currency conversion error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to convert currency'
      }
    });
  }
});

module.exports = router;

