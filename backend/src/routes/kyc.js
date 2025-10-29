const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { query } = require('../config/database');
const logger = require('../utils/logger');

/**
 * @route   POST /api/kyc/submit
 * @desc    Submit KYC documents for verification
 * @access  Private
 */
router.post('/submit', authenticate, async (req, res) => {
  try {
    const { verificationType, verificationNumber, idType, idNumber, documents } = req.body;

    // Validate required fields
    if (!verificationType || !verificationNumber || !idType || !idNumber || !documents) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'All fields are required'
        }
      });
    }

    // Check if user already has pending or verified KYC
    const existingKYC = await query(
      'SELECT id, status FROM users WHERE id = $1 AND kyc_status IN ($2, $3)',
      [req.user.id, 'verified', 'pending']
    );

    if (existingKYC.rows.length > 0 && existingKYC.rows[0].kyc_status === 'verified') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_VERIFIED',
          message: 'Your identity is already verified'
        }
      });
    }

    // In a real implementation, you would:
    // 1. Validate BVN/NIN against CBN database
    // 2. Store documents securely (S3, cloud storage)
    // 3. Create KYC verification record
    // 4. Trigger verification workflow
    // 5. Send notification to compliance team

    // For now, update user KYC status to pending
    await query(
      `UPDATE users 
       SET kyc_status = $1,
           bvn = CASE WHEN $2 = 'bvn' THEN $3 ELSE bvn END,
           nin = CASE WHEN $2 = 'nin' THEN $3 ELSE nin END,
           updated_at = NOW()
       WHERE id = $4`,
      ['pending', verificationType, verificationNumber, req.user.id]
    );

    // TODO: Store documents in secure storage
    // TODO: Call CBN API for BVN/NIN validation
    // TODO: Create audit log entry
    // TODO: Send notification to user and compliance team

    logger.info('KYC documents submitted', {
      userId: req.user.id,
      verificationType,
      idType
    });

    res.status(200).json({
      success: true,
      data: {
        status: 'pending',
        message: 'KYC documents submitted successfully. Verification usually takes 24-48 hours.'
      },
      message: 'KYC submitted for verification'
    });
  } catch (error) {
    logger.error('KYC submission error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to submit KYC documents'
      }
    });
  }
});

/**
 * @route   GET /api/kyc/status
 * @desc    Get KYC verification status
 * @access  Private
 */
router.get('/status', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT kyc_status, kyc_verified_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    const user = result.rows[0];

    res.status(200).json({
      success: true,
      data: {
        status: user.kyc_status || 'pending',
        verifiedAt: user.kyc_verified_at
      }
    });
  } catch (error) {
    logger.error('KYC status check error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to check KYC status'
      }
    });
  }
});

module.exports = router;

