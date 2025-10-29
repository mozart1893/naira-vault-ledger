const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { query } = require('../config/database');
const logger = require('../utils/logger');

/**
 * @route   GET /api/transactions
 * @desc    Get transaction history
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    // Get transactions for the authenticated user
    const result = await query(
      `SELECT id, reference, transaction_type, status, amount, fee, currency, description, metadata, created_at
       FROM transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, parseInt(limit), parseInt(offset)]
    );

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) as total FROM transactions WHERE user_id = $1',
      [req.user.id]
    );

    const total = parseInt(countResult.rows[0].total);
    const transactions = result.rows.map(tx => ({
      id: tx.id,
      reference: tx.reference,
      type: tx.transaction_type,
      status: tx.status,
      amount: parseFloat(tx.amount),
      fee: tx.fee ? parseFloat(tx.fee) : 0,
      currency: tx.currency,
      description: tx.description,
      metadata: tx.metadata,
      createdAt: tx.created_at
    }));

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: Math.floor(parseInt(offset) / parseInt(limit)) + 1,
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    res.status(500).json({
      success: true,
      data: {
        transactions: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      }
    });
  }
});

module.exports = router;
