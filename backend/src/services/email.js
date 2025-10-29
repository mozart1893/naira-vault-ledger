const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create transporter
const createTransporter = () => {
  // For development, use ethereal email (fake SMTP service)
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
    logger.warn('Using development email service (emails will not be sent)');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Send OTP email
 */
const sendOTPEmail = async (email, otpCode) => {
  try {
    const transporter = createTransporter();
    
    // In development without SMTP, just log the OTP
    if (!transporter) {
      logger.info(`[DEV] OTP Email for ${email}: ${otpCode}`);
      console.log(`\n📧 OTP Email for ${email}: ${otpCode}\n`);
      return { success: true, messageId: 'dev-mode' };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@nairavault.com',
      to: email,
      subject: 'Verify Your Email - Naira Vault',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Naira Vault</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #667eea; margin-top: 0;">Email Verification</h2>
            <p>Thank you for registering with Naira Vault. Please use the following OTP to verify your email address:</p>
            <div style="background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0;">${otpCode}</h1>
            </div>
            <p>This OTP will expire in <strong>10 minutes</strong>.</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you didn't request this verification, please ignore this email.
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Naira Vault. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `Your Naira Vault email verification code is: ${otpCode}. This code will expire in 10 minutes.`
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('OTP email sent successfully', { email, messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending OTP email:', error);
    throw error;
  }
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (email, firstName) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      logger.info(`[DEV] Welcome email for ${email}`);
      return { success: true, messageId: 'dev-mode' };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@nairavault.com',
      to: email,
      subject: 'Welcome to Naira Vault!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Naira Vault</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Naira Vault</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #667eea; margin-top: 0;">Welcome ${firstName}!</h2>
            <p>Your account has been successfully created. You can now enjoy all the features of Naira Vault:</p>
            <ul style="line-height: 2;">
              <li>Multi-currency wallet management</li>
              <li>Fast and secure transactions</li>
              <li>Real-time currency conversion</li>
              <li>Comprehensive transaction history</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL || 'http://localhost:3000'}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Naira Vault. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to Naira Vault, ${firstName}! Your account has been successfully created.`
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('Welcome email sent successfully', { email, messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail
};

