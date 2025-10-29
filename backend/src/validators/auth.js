const Joi = require('joi');

/**
 * Registration validation schema
 */
const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{10,14}$/)
    .required()
    .trim()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number with country code (e.g., +2348012345678)',
      'any.required': 'Phone number is required'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  
  firstName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .trim()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name must not exceed 100 characters',
      'any.required': 'First name is required'
    }),
  
  lastName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .trim()
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name must not exceed 100 characters',
      'any.required': 'Last name is required'
    }),
  
  accountType: Joi.string()
    .valid('individual', 'business')
    .default('individual')
    .messages({
      'any.only': 'Account type must be either individual or business'
    })
});

/**
 * OTP verification schema
 */
const verifyOTPSchema = Joi.object({
  email: Joi.string()
    .email()
    .when('phone', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required()
    })
    .lowercase()
    .trim(),
  
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{10,14}$/)
    .trim(),
  
  otpCode: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers',
      'any.required': 'OTP code is required'
    }),
  
  otpType: Joi.string()
    .valid('email', 'phone')
    .required()
    .messages({
      'any.only': 'OTP type must be either email or phone',
      'any.required': 'OTP type is required'
    })
});

/**
 * Resend OTP schema
 */
const resendOTPSchema = Joi.object({
  email: Joi.string()
    .email()
    .when('phone', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required()
    })
    .lowercase()
    .trim(),
  
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{10,14}$/)
    .trim(),
  
  otpType: Joi.string()
    .valid('email', 'phone')
    .required()
});

/**
 * Login schema
 */
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

/**
 * Refresh token schema
 */
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required'
    })
});

module.exports = {
  registerSchema,
  verifyOTPSchema,
  resendOTPSchema,
  loginSchema,
  refreshTokenSchema
};

