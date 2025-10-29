const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { query, transaction } = require('../config/database');
const { convertCurrency, SUPPORTED_CURRENCIES } = require('../services/exchangeRate');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Currency enable/disable status (in-memory for demo, should be in database)
let enabledCurrencies = {
  NGN: true,
  USD: true,
  GBP: true,
  EUR: true
};

/**
 * @route   GET /api/wallets
 * @desc    Get all user wallets
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM wallets WHERE user_id = $1 ORDER BY currency`,
      [req.user.id]
    );

    // Filter only enabled currencies
    const wallets = result.rows.filter(wallet => enabledCurrencies[wallet.currency]);

    res.status(200).json({
      success: true,
      data: wallets.map(w => ({
        id: w.id,
        currency: w.currency,
        ledgerBalance: parseFloat(w.ledger_balance),
        availableBalance: parseFloat(w.available_balance),
        holds: parseFloat(w.ledger_balance) - parseFloat(w.available_balance),
        isActive: w.is_active,
        createdAt: w.created_at
      }))
    });
  } catch (error) {
    logger.error('Error fetching wallets:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch wallets'
      }
    });
  }
});

/**
 * @route   POST /api/wallets/payout
 * @desc    Simulate payout (withdraw from wallet)
 * @access  Private
 */
router.post('/payout', authenticate, async (req, res) => {
  try {
    const { walletId, amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid amount'
        }
      });
    }

    // Get wallet
    const walletResult = await query(
      'SELECT * FROM wallets WHERE id = $1 AND user_id = $2',
      [walletId, req.user.id]
    );

    if (walletResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'WALLET_NOT_FOUND',
          message: 'Wallet not found'
        }
      });
    }

    const wallet = walletResult.rows[0];

    // Check if currency is enabled
    if (!enabledCurrencies[wallet.currency]) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CURRENCY_DISABLED',
          message: 'This currency is currently disabled'
        }
      });
    }

    // Check sufficient balance
    if (parseFloat(wallet.available_balance) < amount) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_FUNDS',
          message: 'Insufficient balance'
        }
      });
    }

    // Create transaction and update wallet in a transaction
    await transaction(async (client) => {
      // Create transaction record
      const txnRef = `PAYOUT-${Date.now()}-${uuidv4().substring(0, 8)}`;
      await client.query(
        `INSERT INTO transactions (reference, user_id, transaction_type, status, amount, currency, description, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          txnRef,
          req.user.id,
          'withdrawal',
          'completed',
          amount,
          wallet.currency,
          description || 'Simulated payout',
          JSON.stringify({ type: 'simulated', walletId })
        ]
      );

      // Update wallet balance
      await client.query(
        `UPDATE wallets 
         SET ledger_balance = ledger_balance - $1,
             available_balance = available_balance - $1,
             updated_at = NOW()
         WHERE id = $2`,
        [amount, walletId]
      );
    });

    logger.info('Payout processed', { userId: req.user.id, amount, currency: wallet.currency });

    res.status(200).json({
      success: true,
      message: 'Payout processed successfully',
      data: {
        transactionType: 'payout',
        amount,
        currency: wallet.currency
      }
    });
  } catch (error) {
    logger.error('Payout error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to process payout'
      }
    });
  }
});

/**
 * @route   POST /api/wallets/convert
 * @desc    Convert currency between wallets
 * @access  Private
 */
router.post('/convert', authenticate, async (req, res) => {
  try {
    const { fromWalletId, toWalletId, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid amount'
        }
      });
    }

    // Get both wallets
    const walletsResult = await query(
      'SELECT * FROM wallets WHERE (id = $1 OR id = $2) AND user_id = $3',
      [fromWalletId, toWalletId, req.user.id]
    );

    if (walletsResult.rows.length !== 2) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'WALLET_NOT_FOUND',
          message: 'One or both wallets not found'
        }
      });
    }

    const fromWallet = walletsResult.rows.find(w => w.id === fromWalletId);
    const toWallet = walletsResult.rows.find(w => w.id === toWalletId);

    // Check currencies are enabled
    if (!enabledCurrencies[fromWallet.currency] || !enabledCurrencies[toWallet.currency]) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CURRENCY_DISABLED',
          message: 'One or both currencies are disabled'
        }
      });
    }

    // Check sufficient balance
    if (parseFloat(fromWallet.available_balance) < amount) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_FUNDS',
          message: 'Insufficient balance for conversion'
        }
      });
    }

    // Get exchange rate
    const conversion = await convertCurrency(amount, fromWallet.currency, toWallet.currency);
    const convertedAmount = conversion.toAmount;
    const fee = convertedAmount * 0.01; // 1% conversion fee
    const netAmount = convertedAmount - fee;

    // Process conversion in transaction
    await transaction(async (client) => {
      const txnRef = `CONVERT-${Date.now()}-${uuidv4().substring(0, 8)}`;

      // Create transaction record
      await client.query(
        `INSERT INTO transactions (reference, user_id, transaction_type, status, amount, fee, currency, description, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          txnRef,
          req.user.id,
          'conversion',
          'completed',
          amount,
          fee,
          fromWallet.currency,
          `Converted ${amount} ${fromWallet.currency} to ${toWallet.currency}`,
          JSON.stringify({
            type: 'conversion',
            fromWallet: fromWalletId,
            toWallet: toWalletId,
            fromCurrency: fromWallet.currency,
            toCurrency: toWallet.currency,
            rate: conversion.rate,
            convertedAmount,
            fee
          })
        ]
      );

      // Deduct from source wallet
      await client.query(
        `UPDATE wallets 
         SET ledger_balance = ledger_balance - $1,
             available_balance = available_balance - $1,
             updated_at = NOW()
         WHERE id = $2`,
        [amount, fromWalletId]
      );

      // Add to destination wallet
      await client.query(
        `UPDATE wallets 
         SET ledger_balance = ledger_balance + $1,
             available_balance = available_balance + $1,
             updated_at = NOW()
         WHERE id = $2`,
        [netAmount, toWalletId]
      );

      // Record conversion details
      await client.query(
        `INSERT INTO currency_conversions (transaction_id, from_currency, to_currency, from_amount, to_amount, rate, fee)
         SELECT id, $2, $3, $4, $5, $6, $7 FROM transactions WHERE reference = $1`,
        [txnRef, fromWallet.currency, toWallet.currency, amount, netAmount, conversion.rate, fee]
      );
    });

    logger.info('Currency conversion completed', {
      userId: req.user.id,
      from: fromWallet.currency,
      to: toWallet.currency,
      amount,
      convertedAmount: netAmount
    });

    res.status(200).json({
      success: true,
      message: 'Currency converted successfully',
      data: {
        fromCurrency: fromWallet.currency,
        toCurrency: toWallet.currency,
        fromAmount: amount,
        convertedAmount,
        fee,
        netAmount,
        rate: conversion.rate
      }
    });
  } catch (error) {
    logger.error('Conversion error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to convert currency'
      }
    });
  }
});

/**
 * @route   GET /api/wallets/enabled-currencies
 * @desc    Get list of enabled currencies
 * @access  Private
 */
router.get('/enabled-currencies', authenticate, async (req, res) => {
  try {
    const enabled = Object.keys(enabledCurrencies).filter(curr => enabledCurrencies[curr]);
    
    res.status(200).json({
      success: true,
      data: enabled
    });
  } catch (error) {
    logger.error('Error fetching enabled currencies:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch enabled currencies'
      }
    });
  }
});

module.exports = router;
module.exports.enabledCurrencies = enabledCurrencies; // Export for admin routes
