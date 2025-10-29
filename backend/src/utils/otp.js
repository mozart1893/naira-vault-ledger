const crypto = require('crypto');
const { query } = require('../config/database');
const logger = require('./logger');

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Create OTP record in database
 */
const createOTP = async ({ userId = null, email = null, phone = null, otpType, purpose, client = null }) => {
  try {
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const queryFn = client || query;
    const queryMethod = client ? client.query.bind(client) : query;

    const result = await queryMethod(
      `INSERT INTO otp_verifications 
       (user_id, email, phone, otp_code, otp_type, purpose, expires_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, otp_code, expires_at`,
      [userId, email, phone, otpCode, otpType, purpose, expiresAt]
    );

    logger.info('OTP created', { otpType, purpose, email, phone });
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating OTP:', error);
    throw error;
  }
};

/**
 * Verify OTP code
 */
const verifyOTP = async ({ email = null, phone = null, otpCode, otpType, purpose }) => {
  try {
    // Find the OTP record
    const whereClause = email 
      ? 'email = $1' 
      : 'phone = $1';
    const identifier = email || phone;

    const result = await query(
      `SELECT * FROM otp_verifications 
       WHERE ${whereClause} 
       AND otp_type = $2 
       AND purpose = $3 
       AND is_verified = false 
       AND expires_at > NOW() 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [identifier, otpType, purpose]
    );

    if (result.rows.length === 0) {
      return { success: false, message: 'OTP not found or expired' };
    }

    const otpRecord = result.rows[0];

    // Check attempts
    if (otpRecord.attempts >= 5) {
      return { success: false, message: 'Too many failed attempts' };
    }

    // Verify OTP code
    if (otpRecord.otp_code !== otpCode) {
      // Increment attempts
      await query(
        'UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = $1',
        [otpRecord.id]
      );
      return { success: false, message: 'Invalid OTP code' };
    }

    // Mark as verified
    await query(
      'UPDATE otp_verifications SET is_verified = true, verified_at = NOW() WHERE id = $1',
      [otpRecord.id]
    );

    logger.info('OTP verified successfully', { otpType, purpose, email, phone });
    return { success: true, message: 'OTP verified successfully', userId: otpRecord.user_id };
  } catch (error) {
    logger.error('Error verifying OTP:', error);
    throw error;
  }
};

/**
 * Invalidate all OTPs for a user/email/phone
 */
const invalidateOTPs = async ({ userId = null, email = null, phone = null }) => {
  try {
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (userId) {
      conditions.push(`user_id = $${paramIndex++}`);
      params.push(userId);
    }
    if (email) {
      conditions.push(`email = $${paramIndex++}`);
      params.push(email);
    }
    if (phone) {
      conditions.push(`phone = $${paramIndex++}`);
      params.push(phone);
    }

    if (conditions.length === 0) {
      throw new Error('At least one identifier required');
    }

    await query(
      `UPDATE otp_verifications 
       SET is_verified = true 
       WHERE ${conditions.join(' AND ')} 
       AND is_verified = false`,
      params
    );

    logger.info('OTPs invalidated', { userId, email, phone });
  } catch (error) {
    logger.error('Error invalidating OTPs:', error);
    throw error;
  }
};

module.exports = {
  generateOTP,
  createOTP,
  verifyOTP,
  invalidateOTPs
};

