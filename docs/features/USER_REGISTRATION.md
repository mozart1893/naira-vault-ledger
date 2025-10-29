# User Registration Feature - US-001

## Overview

This document describes the implementation of the user registration feature with email and phone verification via OTP (One-Time Password).

## User Story

**US-001: User Registration**

As a new user, I want to register with my email and phone number so that I can create an account.

### Acceptance Criteria ✅

- [x] User can enter email, phone number, and password
- [x] System verifies email and phone via OTP
- [x] User can complete registration after verification

## Features

### Registration Flow

1. **Step 1: User Registration**
   - User enters personal information:
     - First Name
     - Last Name
     - Email
     - Phone Number (with country code)
     - Password (with strength requirements)
     - Confirm Password
   - System validates input
   - System creates user account
   - System sends OTP codes to both email and phone

2. **Step 2: Email Verification**
   - User receives 6-digit OTP code via email
   - User enters OTP code
   - System validates OTP
   - OTP expires after 10 minutes
   - Maximum 5 verification attempts
   - User can resend OTP if needed

3. **Step 3: Phone Verification**
   - User receives 6-digit OTP code via SMS
   - User enters OTP code
   - System validates OTP
   - OTP expires after 10 minutes
   - Maximum 5 verification attempts
   - User can resend OTP if needed

4. **Step 4: Completion**
   - User is automatically logged in
   - Welcome email is sent
   - User is redirected to dashboard

## Technical Implementation

### Backend

#### Database Schema

**Users Table Updates:**
```sql
- email_verified (BOOLEAN)
- phone_verified (BOOLEAN)
- password_hash (VARCHAR)
- is_active (BOOLEAN)
- last_login_at (TIMESTAMP)
```

**New OTP Verifications Table:**
```sql
CREATE TABLE otp_verifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    email VARCHAR(255),
    phone VARCHAR(20),
    otp_code VARCHAR(6),
    otp_type VARCHAR(20), -- 'email' or 'phone'
    purpose VARCHAR(50), -- 'registration', 'login', 'password_reset'
    is_verified BOOLEAN,
    attempts INTEGER,
    expires_at TIMESTAMP,
    verified_at TIMESTAMP,
    created_at TIMESTAMP
);
```

#### API Endpoints

**POST /api/auth/register**
- Register new user
- Sends OTP to email and phone
- Returns user ID for verification steps

**POST /api/auth/verify-otp**
- Verify email or phone OTP
- Returns JWT token when both verifications complete

**POST /api/auth/resend-otp**
- Resend OTP code
- Invalidates previous OTPs

**POST /api/auth/login**
- Login with email and password
- Requires both email and phone to be verified

#### Services

1. **Email Service** (`services/email.js`)
   - Send OTP emails
   - Send welcome emails
   - Uses Nodemailer
   - Supports development mode (logs to console)

2. **SMS Service** (`services/sms.js`)
   - Send OTP via SMS
   - Uses Termii API
   - Supports development mode (logs to console)

3. **OTP Service** (`utils/otp.js`)
   - Generate random 6-digit OTP
   - Store OTP in database
   - Verify OTP codes
   - Handle expiration and attempts

#### Security Features

1. **Password Requirements:**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

2. **OTP Security:**
   - 6-digit random codes
   - 10-minute expiration
   - Maximum 5 attempts
   - One-time use only
   - Cannot reuse old OTPs

3. **JWT Authentication:**
   - Secure token generation
   - Token expiration (24 hours)
   - Refresh token support (7 days)

### Frontend

#### Pages

1. **Register Page** (`/register`)
   - Multi-step registration form
   - Real-time validation
   - Progress indicator
   - Email OTP verification
   - Phone OTP verification
   - Success confirmation

2. **Login Page** (`/login`)
   - Email and password login
   - Forgot password link
   - Link to registration

#### Components Used

- Form validation with React Hook Form + Zod
- shadcn/ui components:
  - Card, Input, Button
  - InputOTP for code entry
  - Alert for error messages
  - Toast notifications
- Progress stepper UI

#### Client-Side Validation

```typescript
- Email: Valid email format
- Phone: E.164 format (+2348012345678)
- Password: Minimum 8 chars with complexity requirements
- OTP: Exactly 6 digits
```

## API Request/Response Examples

### 1. Register User

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "phone": "+2348012345678",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "accountType": "individual"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "email": "user@example.com",
    "phone": "+2348012345678",
    "firstName": "John",
    "lastName": "Doe",
    "accountType": "individual",
    "message": "Registration successful. Please verify your email and phone number."
  },
  "message": "Registration successful. OTP codes sent to your email and phone."
}
```

### 2. Verify Email OTP

**Request:**
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otpCode": "123456",
  "otpType": "email"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "emailVerified": true,
    "phoneVerified": false,
    "message": "Email verified successfully. Please verify your phone."
  }
}
```

### 3. Verify Phone OTP (Final Step)

**Request:**
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "+2348012345678",
  "otpCode": "654321",
  "otpType": "phone"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "phone": "+2348012345678",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt-token-here",
    "refreshToken": "refresh-token-here",
    "message": "Verification complete. Welcome to Naira Vault!"
  }
}
```

### 4. Resend OTP

**Request:**
```http
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otpType": "email"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "New OTP sent to your email"
  }
}
```

## Environment Variables

### Backend (.env)

```bash
# SMTP Configuration (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@nairavault.com

# SMS Configuration
SMS_API_URL=https://api.termii.com/v1/sms/send
SMS_API_KEY=your_termii_api_key
SMS_SENDER_ID=NairaVault

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=7d

# Password Hashing
BCRYPT_ROUNDS=12
```

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:8000/api
```

## Development Mode

In development mode without SMTP or SMS credentials:
- OTP codes are logged to console
- Email content is displayed in terminal
- SMS content is displayed in terminal
- Registration still works for testing

**Example Console Output:**
```
📧 OTP Email for user@example.com: 123456
📱 OTP SMS for +2348012345678: 654321
```

## Testing

### Manual Testing Steps

1. **Start the Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start the Frontend:**
   ```bash
   npm install
   npm run dev
   ```

3. **Test Registration Flow:**
   - Navigate to http://localhost:3000/register
   - Fill in registration form
   - Click "Create Account"
   - Check console/terminal for OTP codes
   - Enter email OTP code
   - Enter phone OTP code
   - Verify successful login and redirect

### Test Credentials

For development/testing, you can use:
- Email: test@nairavault.com
- Password: Test@123
- Phone: +2348012345678

## Error Handling

### Common Errors

1. **Duplicate Email/Phone:**
   - Status: 409 Conflict
   - Message: "User already exists with this email or phone number"

2. **Invalid OTP:**
   - Status: 400 Bad Request
   - Message: "Invalid OTP code"

3. **Expired OTP:**
   - Status: 400 Bad Request
   - Message: "OTP not found or expired"

4. **Too Many Attempts:**
   - Status: 400 Bad Request
   - Message: "Too many failed attempts"

5. **Weak Password:**
   - Status: 400 Bad Request
   - Details: Specific password requirements not met

## Security Considerations

1. **Password Storage:**
   - Hashed using bcrypt with 12 rounds
   - Never stored in plain text
   - Never returned in API responses

2. **OTP Storage:**
   - Stored temporarily in database
   - Automatically expires after 10 minutes
   - Invalidated after successful verification

3. **Rate Limiting:**
   - Applied to all auth endpoints
   - Prevents brute force attacks
   - 100 requests per 15 minutes per IP

4. **Input Validation:**
   - Server-side validation with Joi
   - Client-side validation with Zod
   - Sanitization of all inputs

## Future Enhancements

- [ ] Social authentication (Google, Facebook)
- [ ] Biometric authentication
- [ ] Two-factor authentication (2FA)
- [ ] Email/phone verification via link (alternative to OTP)
- [ ] Account recovery via email
- [ ] Password strength meter on UI
- [ ] Remember device functionality
- [ ] Session management dashboard

## Support

For issues or questions:
- Check logs in `backend/logs/`
- Review error messages in browser console
- Check OTP codes in terminal (development mode)
- Ensure database is running and migrated
- Verify environment variables are set correctly

## Changelog

### Version 1.0.0 (Current)
- Initial implementation of user registration
- Email verification via OTP
- Phone verification via OTP
- JWT authentication
- Welcome email
- Multi-step registration UI
- Error handling and validation
- Development mode support

