const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Send OTP via SMS using Termii API
 */
const sendOTPSMS = async (phone, otpCode) => {
  try {
    // In development without SMS credentials, just log the OTP
    if (process.env.NODE_ENV === 'development' && !process.env.SMS_API_KEY) {
      logger.info(`[DEV] OTP SMS for ${phone}: ${otpCode}`);
      console.log(`\n📱 OTP SMS for ${phone}: ${otpCode}\n`);
      return { success: true, messageId: 'dev-mode' };
    }

    const message = `Your Naira Vault verification code is: ${otpCode}. This code will expire in 10 minutes.`;

    const response = await axios.post(
      process.env.SMS_API_URL || 'https://api.termii.com/api/sms/send',
      {
        to: phone.replace('+', ''),
        from: process.env.SMS_SENDER_ID || 'NairaVault',
        sms: message,
        type: 'plain',
        channel: 'generic',
        api_key: process.env.SMS_API_KEY
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    logger.info('OTP SMS sent successfully', { 
      phone, 
      messageId: response.data.message_id 
    });

    return { 
      success: true, 
      messageId: response.data.message_id 
    };
  } catch (error) {
    logger.error('Error sending OTP SMS:', error.response?.data || error.message);
    
    // Don't fail registration if SMS fails, just log it
    if (process.env.NODE_ENV === 'development') {
      logger.warn('SMS sending failed in development, continuing anyway');
      console.log(`\n📱 [FAILED] OTP SMS for ${phone}: ${otpCode}\n`);
      return { success: true, messageId: 'dev-mode-fallback' };
    }
    
    throw error;
  }
};

module.exports = {
  sendOTPSMS
};

