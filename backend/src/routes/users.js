const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, async (req, res) => {
  try {
    const { query } = require('../config/database');
    
    // Get complete user profile
    const result = await query(
      `SELECT id, email, first_name, last_name, phone, kyc_status, account_type, 
              email_verified, phone_verified, created_at, last_login_at
       FROM users WHERE id = $1`,
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
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      kycStatus: user.kyc_status,
      accountType: user.account_type,
      emailVerified: user.email_verified,
      phoneVerified: user.phone_verified,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at
    };

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch profile'
      }
    });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { query } = require('../config/database');
    const { firstName, lastName, phone } = req.body;

    // Validate input
    if (!firstName && !lastName && !phone) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'At least one field is required to update'
        }
      });
    }

    // Build update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (firstName) {
      updates.push(`first_name = $${paramIndex++}`);
      values.push(firstName);
    }
    if (lastName) {
      updates.push(`last_name = $${paramIndex++}`);
      values.push(lastName);
    }
    if (phone) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(phone);
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.user.id);

    const result = await query(
      `UPDATE users 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, email, first_name, last_name, phone, kyc_status, account_type`,
      values
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
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      kycStatus: user.kyc_status,
      accountType: user.account_type
    };

    res.status(200).json({
      success: true,
      data: userData,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update profile'
      }
    });
  }
});

module.exports = router;

