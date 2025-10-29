const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, transaction } = require('../config/database');
const { createOTP, verifyOTP, invalidateOTPs } = require('../utils/otp');
const { sendOTPEmail, sendWelcomeEmail } = require('../services/email');
const { sendOTPSMS } = require('../services/sms');
const logger = require('../utils/logger');

/**
 * Generate JWT tokens
 */
const generateTokens = (userId) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h'; // 1 hour default
  
  const accessToken = jwt.sign(
    { userId, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, // 1 hour from now
    process.env.JWT_SECRET,
    { expiresIn }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken, expiresIn: 3600 }; // Return expiry in seconds
};

/**
 * Register new user (Step 1: Create account and send OTPs)
 */
const register = async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName, accountType } = req.body;

    // Check if user already exists
    const existingUser = await query(
      'SELECT id, email, phone, email_verified, phone_verified FROM users WHERE email = $1 OR phone = $2',
      [email, phone]
    );

    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      
      // If user exists and both verifications are complete, return error
      if (user.email_verified && user.phone_verified) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_RESOURCE',
            message: 'User already exists with this email or phone number'
          }
        });
      }

      // If user exists but not verified, allow re-sending OTPs
      if (user.email === email && !user.email_verified) {
        // Generate and send new OTPs
        const emailOTP = await createOTP({
          userId: user.id,
          email,
          otpType: 'email',
          purpose: 'registration'
        });

        const phoneOTP = await createOTP({
          userId: user.id,
          phone,
          otpType: 'phone',
          purpose: 'registration'
        });

        // Send OTPs
        await Promise.all([
          sendOTPEmail(email, emailOTP.otp_code),
          sendOTPSMS(phone, phoneOTP.otp_code)
        ]);

        return res.status(200).json({
          success: true,
          data: {
            userId: user.id,
            email,
            phone,
            message: 'OTPs resent. Please verify your email and phone number.'
          }
        });
      }

      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_RESOURCE',
          message: 'User already exists'
        }
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user and OTPs in a transaction
    const result = await transaction(async (client) => {
      // Insert user
      const userResult = await client.query(
        `INSERT INTO users 
         (email, phone, password_hash, first_name, last_name, account_type) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, email, phone, first_name, last_name, account_type, created_at`,
        [email, phone, passwordHash, firstName, lastName, accountType || 'individual']
      );

      const user = userResult.rows[0];

      // Generate OTPs within the same transaction
      const emailOTP = await createOTP({
        userId: user.id,
        email,
        otpType: 'email',
        purpose: 'registration',
        client // Pass the transaction client
      });

      const phoneOTP = await createOTP({
        userId: user.id,
        phone,
        otpType: 'phone',
        purpose: 'registration',
        client // Pass the transaction client
      });

      return { user, emailOTP, phoneOTP };
    });

    // Send OTPs (don't wait for these to complete)
    Promise.all([
      sendOTPEmail(email, result.emailOTP.otp_code),
      sendOTPSMS(phone, result.phoneOTP.otp_code)
    ]).catch(error => {
      logger.error('Error sending OTPs:', error);
    });

    logger.info('User registered successfully', { 
      userId: result.user.id, 
      email 
    });

    res.status(201).json({
      success: true,
      data: {
        userId: result.user.id,
        email: result.user.email,
        phone: result.user.phone,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
        accountType: result.user.account_type,
        message: 'Registration successful. Please verify your email and phone number.'
      },
      message: 'Registration successful. OTP codes sent to your email and phone.'
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Registration failed. Please try again.'
      }
    });
  }
};

/**
 * Verify OTP (Step 2: Verify email or phone)
 */
const verifyOTPHandler = async (req, res) => {
  try {
    const { email, phone, otpCode, otpType } = req.body;

    // Verify the OTP
    const verification = await verifyOTP({
      email,
      phone,
      otpCode,
      otpType,
      purpose: 'registration'
    });

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: verification.message
        }
      });
    }

    // Update user verification status
    const field = otpType === 'email' ? 'email_verified' : 'phone_verified';
    const identifier = otpType === 'email' ? email : phone;
    const whereClause = otpType === 'email' ? 'email = $1' : 'phone = $1';

    const result = await query(
      `UPDATE users 
       SET ${field} = true 
       WHERE ${whereClause} 
       RETURNING id, email, phone, email_verified, phone_verified, first_name, last_name`,
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    const user = result.rows[0];

    // Check if both email and phone are verified
    const isFullyVerified = user.email_verified && user.phone_verified;

    // If fully verified, send welcome email and generate tokens
    if (isFullyVerified) {
      // Send welcome email
      sendWelcomeEmail(user.email, user.first_name).catch(error => {
        logger.error('Error sending welcome email:', error);
      });

      // Generate tokens
      const tokens = generateTokens(user.id);

      // Update last login
      await query(
        'UPDATE users SET last_login_at = NOW() WHERE id = $1',
        [user.id]
      );

      logger.info('User fully verified and logged in', { userId: user.id });

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            firstName: user.first_name,
            lastName: user.last_name
          },
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          message: 'Verification complete. Welcome to Naira Vault!'
        },
        message: 'Verification successful'
      });
    }

    // Partial verification
    res.status(200).json({
      success: true,
      data: {
        userId: user.id,
        emailVerified: user.email_verified,
        phoneVerified: user.phone_verified,
        message: `${otpType === 'email' ? 'Email' : 'Phone'} verified successfully. Please verify your ${otpType === 'email' ? 'phone' : 'email'}.`
      },
      message: 'Verification successful'
    });
  } catch (error) {
    logger.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Verification failed. Please try again.'
      }
    });
  }
};

/**
 * Resend OTP
 */
const resendOTP = async (req, res) => {
  try {
    const { email, phone, otpType } = req.body;

    // Find user
    const identifier = otpType === 'email' ? email : phone;
    const whereClause = otpType === 'email' ? 'email = $1' : 'phone = $1';

    const result = await query(
      `SELECT id, email, phone, email_verified, phone_verified FROM users WHERE ${whereClause}`,
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    const user = result.rows[0];

    // Check if already verified
    const isVerified = otpType === 'email' ? user.email_verified : user.phone_verified;
    if (isVerified) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `${otpType === 'email' ? 'Email' : 'Phone'} already verified`
        }
      });
    }

    // Invalidate old OTPs
    await invalidateOTPs({ userId: user.id });

    // Create new OTP
    const otp = await createOTP({
      userId: user.id,
      email: otpType === 'email' ? email : null,
      phone: otpType === 'phone' ? phone : null,
      otpType,
      purpose: 'registration'
    });

    // Send OTP
    if (otpType === 'email') {
      await sendOTPEmail(email, otp.otp_code);
    } else {
      await sendOTPSMS(phone, otp.otp_code);
    }

    logger.info('OTP resent', { userId: user.id, otpType });

    res.status(200).json({
      success: true,
      data: {
        message: `New OTP sent to your ${otpType === 'email' ? 'email' : 'phone'}`
      },
      message: 'OTP sent successfully'
    });
  } catch (error) {
    logger.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to resend OTP. Please try again.'
      }
    });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await query(
      `SELECT id, email, password_hash, first_name, last_name, phone, 
              email_verified, phone_verified, is_active, kyc_status, account_type 
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid email or password'
        }
      });
    }

    const user = result.rows[0];

    // Check if account is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Account is deactivated'
        }
      });
    }

    // Check if email and phone are verified
    if (!user.email_verified || !user.phone_verified) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'VERIFICATION_REQUIRED',
          message: 'Please verify your email and phone number before logging in',
          details: {
            emailVerified: user.email_verified,
            phoneVerified: user.phone_verified
          }
        }
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid email or password'
        }
      });
    }

    // Generate tokens
    const tokens = generateTokens(user.id);

    // Update last login
    await query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    logger.info('User logged in successfully', { userId: user.id });

    res.status(200).json({
      success: true,
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 86400, // 24 hours in seconds
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          kycStatus: user.kyc_status,
          accountType: user.account_type
        }
      },
      message: 'Login successful'
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Login failed. Please try again.'
      }
    });
  }
};

/**
 * Refresh access token
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    // Verify refresh token
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    // Generate new tokens
    const tokens = generateTokens(decoded.userId);

    res.status(200).json({
      success: true,
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 86400
      },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid or expired refresh token'
        }
      });
    }

    logger.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Token refresh failed'
      }
    });
  }
};

/**
 * Logout user
 */
const logout = async (req, res) => {
  try {
    // In a production app, you might want to blacklist the token here
    // For now, we'll just return success
    
    logger.info('User logged out', { userId: req.user?.id });

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Logout failed'
      }
    });
  }
};

module.exports = {
  register,
  verifyOTPHandler,
  resendOTP,
  login,
  refreshToken,
  logout
};

