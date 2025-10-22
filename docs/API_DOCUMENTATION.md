# Naira Vault Ledger System - API Documentation

## Overview

The Naira Vault Ledger System provides a comprehensive RESTful API for managing multi-currency digital wallets, transactions, and financial operations. This documentation covers all available endpoints, request/response formats, and authentication requirements.

## Base URL

```
Development: http://localhost:8000/api
Production: https://api.nairavault.com/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "phone": "+2348012345678",
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
    "userId": "uuid",
    "email": "user@example.com",
    "kycStatus": "pending",
    "accountType": "individual"
  },
  "message": "User registered successfully"
}
```

#### POST /auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresIn": 3600,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

#### POST /auth/refresh
Refresh JWT token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

#### POST /auth/logout
Logout user and invalidate tokens.

### User Management Endpoints

#### GET /users/profile
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "phone": "+2348012345678",
    "firstName": "John",
    "lastName": "Doe",
    "kycStatus": "verified",
    "accountType": "individual",
    "createdAt": "2025-01-20T10:30:00Z"
  }
}
```

#### PUT /users/profile
Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2348012345678"
}
```

#### POST /users/kyc
Submit KYC verification documents.

**Request Body:**
```json
{
  "bvn": "12345678901",
  "nin": "12345678901",
  "documents": {
    "idCard": "base64-encoded-image",
    "utilityBill": "base64-encoded-image"
  }
}
```

### Wallet Management Endpoints

#### GET /wallets
Get all user wallets.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "currency": "NGN",
      "ledgerBalance": 250000.00,
      "availableBalance": 240000.00,
      "holds": 10000.00,
      "isActive": true,
      "createdAt": "2025-01-20T10:30:00Z"
    }
  ]
}
```

#### POST /wallets
Create a new wallet.

**Request Body:**
```json
{
  "currency": "USD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "currency": "USD",
    "ledgerBalance": 0.00,
    "availableBalance": 0.00,
    "holds": 0.00,
    "isActive": true
  },
  "message": "Wallet created successfully"
}
```

#### GET /wallets/{walletId}
Get specific wallet details.

#### PUT /wallets/{walletId}
Update wallet settings.

### Transaction Endpoints

#### GET /transactions
Get transaction history with pagination and filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `type`: Transaction type (deposit, withdrawal, transfer, conversion)
- `status`: Transaction status (pending, completed, failed, reversed)
- `currency`: Currency code
- `startDate`: Start date (ISO 8601)
- `endDate`: End date (ISO 8601)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "reference": "TXN12345678",
        "type": "deposit",
        "status": "completed",
        "amount": 100000.00,
        "currency": "NGN",
        "description": "Salary payment",
        "fee": 0.00,
        "createdAt": "2025-01-20T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### POST /transactions/deposit
Create a deposit transaction.

**Request Body:**
```json
{
  "walletId": "uuid",
  "amount": 100000.00,
  "currency": "NGN",
  "description": "Bank transfer deposit",
  "paymentMethod": "bank_transfer"
}
```

#### POST /transactions/withdrawal
Create a withdrawal transaction.

**Request Body:**
```json
{
  "walletId": "uuid",
  "amount": 50000.00,
  "currency": "NGN",
  "description": "ATM withdrawal",
  "destination": {
    "type": "bank_account",
    "accountNumber": "1234567890",
    "bankCode": "058"
  }
}
```

#### POST /transactions/transfer
Create a transfer transaction.

**Request Body:**
```json
{
  "fromWalletId": "uuid",
  "toWalletId": "uuid",
  "amount": 10000.00,
  "currency": "NGN",
  "description": "Transfer to savings"
}
```

#### POST /transactions/conversion
Create a currency conversion transaction.

**Request Body:**
```json
{
  "fromWalletId": "uuid",
  "toWalletId": "uuid",
  "fromAmount": 100000.00,
  "fromCurrency": "NGN",
  "toCurrency": "USD",
  "description": "NGN to USD conversion"
}
```

#### GET /transactions/{transactionId}
Get specific transaction details.

### Currency & Exchange Rate Endpoints

#### GET /currency/rates
Get current exchange rates.

**Response:**
```json
{
  "success": true,
  "data": {
    "rates": [
      {
        "fromCurrency": "NGN",
        "toCurrency": "USD",
        "rate": 0.00067,
        "source": "CBN",
        "lastUpdated": "2025-01-20T10:30:00Z"
      }
    ],
    "lastUpdated": "2025-01-20T10:30:00Z"
  }
}
```

#### POST /currency/convert
Convert between currencies.

**Request Body:**
```json
{
  "fromCurrency": "NGN",
  "toCurrency": "USD",
  "amount": 100000.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fromCurrency": "NGN",
    "toCurrency": "USD",
    "fromAmount": 100000.00,
    "toAmount": 67.00,
    "rate": 0.00067,
    "fee": 1.68,
    "totalCost": 68.68
  }
}
```

### Payment Method Endpoints

#### GET /payment-methods
Get user payment methods.

#### POST /payment-methods
Add a new payment method.

**Request Body:**
```json
{
  "type": "bank_account",
  "provider": "gtbank",
  "details": {
    "accountNumber": "1234567890",
    "accountName": "John Doe",
    "bankCode": "058"
  },
  "isDefault": false
}
```

#### PUT /payment-methods/{methodId}
Update payment method.

#### DELETE /payment-methods/{methodId}
Remove payment method.

### Audit & Reporting Endpoints

#### GET /audit/logs
Get audit logs (admin only).

**Query Parameters:**
- `userId`: Filter by user ID
- `entityType`: Filter by entity type
- `action`: Filter by action
- `startDate`: Start date
- `endDate`: End date
- `page`: Page number
- `limit`: Items per page

#### GET /reports/transactions
Generate transaction reports.

**Query Parameters:**
- `startDate`: Report start date
- `endDate`: Report end date
- `currency`: Currency filter
- `format`: Response format (json, csv, pdf)

### System Endpoints

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-20T10:30:00Z",
  "uptime": 3600,
  "version": "1.0.0",
  "services": {
    "database": "OK",
    "redis": "OK",
    "external_apis": "OK"
  }
}
```

#### GET /system/status
Get system status and metrics.

## Error Codes

### HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Custom Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Authentication failed
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `RESOURCE_NOT_FOUND`: Resource not found
- `DUPLICATE_RESOURCE`: Resource already exists
- `INSUFFICIENT_FUNDS`: Insufficient wallet balance
- `TRANSACTION_LIMIT_EXCEEDED`: Transaction limit exceeded
- `KYC_REQUIRED`: KYC verification required
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded
- `SERVICE_UNAVAILABLE`: External service unavailable

## Rate Limiting

### Limits
- **General API**: 100 requests per minute per IP
- **Authentication**: 10 requests per minute per IP
- **Transaction API**: 50 requests per minute per user
- **Currency API**: 200 requests per minute per user

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Transaction Webhooks
The system sends webhooks for transaction status changes:

**Endpoint**: `POST /webhooks/transactions`

**Headers:**
```
X-Webhook-Signature: sha256=signature
Content-Type: application/json
```

**Payload:**
```json
{
  "event": "transaction.completed",
  "data": {
    "transactionId": "uuid",
    "reference": "TXN12345678",
    "status": "completed",
    "amount": 100000.00,
    "currency": "NGN",
    "userId": "uuid"
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### Supported Events
- `transaction.created`
- `transaction.completed`
- `transaction.failed`
- `transaction.reversed`
- `wallet.created`
- `wallet.updated`
- `user.kyc_verified`

## SDKs and Libraries

### JavaScript/Node.js
```bash
npm install @nairavault/api-client
```

```javascript
import { NairaVaultClient } from '@nairavault/api-client';

const client = new NairaVaultClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.nairavault.com'
});

// Get user wallets
const wallets = await client.wallets.getAll();
```

### Python
```bash
pip install nairavault-python
```

```python
from nairavault import NairaVaultClient

client = NairaVaultClient(
    api_key='your-api-key',
    base_url='https://api.nairavault.com'
)

# Get user wallets
wallets = client.wallets.get_all()
```

## Testing

### Sandbox Environment
Use the sandbox environment for testing:
```
Base URL: https://sandbox-api.nairavault.com/api
```

### Test Data
- **Test User**: test@nairavault.com
- **Test Wallets**: Pre-configured with test balances
- **Test Cards**: Use test card numbers for payments

### Postman Collection
Import our Postman collection for easy API testing:
```
https://api.nairavault.com/docs/postman-collection.json
```

## Support

### Documentation
- **API Reference**: https://docs.nairavault.com/api
- **SDK Documentation**: https://docs.nairavault.com/sdk
- **Webhook Guide**: https://docs.nairavault.com/webhooks

### Support Channels
- **Email**: support@nairavault.com
- **Slack**: #nairavault-support
- **GitHub**: https://github.com/nairavault/support

### Status Page
Monitor API status and incidents:
```
https://status.nairavault.com
```

---

This API documentation provides comprehensive information about all available endpoints, request/response formats, authentication, and integration guidelines for the Naira Vault Ledger System.
