const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  registerSchema,
  verifyOTPSchema,
  resendOTPSchema,
  loginSchema,
  refreshTokenSchema
} = require('../validators/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user and send OTPs
 * @access  Public
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP for email or phone
 * @access  Public
 */
router.post('/verify-otp', validate(verifyOTPSchema), authController.verifyOTPHandler);

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP for email or phone
 * @access  Public
 */
router.post('/resend-otp', validate(resendOTPSchema), authController.resendOTP);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

module.exports = router;

