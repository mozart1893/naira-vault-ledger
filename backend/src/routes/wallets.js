const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/wallets
 * @desc    Get all user wallets
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  res.status(200).json({
    success: true,
    data: []
  });
});

module.exports = router;

