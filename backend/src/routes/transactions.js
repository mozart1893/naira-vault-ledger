const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/transactions
 * @desc    Get transaction history
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  res.status(200).json({
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
});

module.exports = router;

