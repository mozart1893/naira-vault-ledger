const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/currency/rates
 * @desc    Get current exchange rates
 * @access  Public
 */
router.get('/rates', async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      rates: [],
      lastUpdated: new Date().toISOString()
    }
  });
});

module.exports = router;

