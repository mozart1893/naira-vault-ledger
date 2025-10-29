# Quick Start Guide - Naira Vault Ledger

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd naira-vault-ledger
```

### 2. Environment Configuration

#### Copy Environment Files

```bash
# Copy root environment file
cp env.sample .env

# Create backend environment file
cp backend/.env.sample backend/.env
```

#### Update Environment Variables

Edit `.env` and `backend/.env` with your configuration:

**Root `.env`:**
```bash
VITE_API_URL=http://localhost:8000/api
```

**Backend `backend/.env`:**
```bash
# Database
DATABASE_URL=postgresql://naira_vault:naira_vault_password@localhost:5432/naira_vault_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Email (Optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@nairavault.com

# SMS (Optional for development)
SMS_API_URL=https://api.termii.com/v1/sms/send
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=NairaVault
```

> **Note:** For development without email/SMS providers, the system will log OTP codes to the console.

### 3. Start with Docker Compose (Recommended)

This will start PostgreSQL, Redis, Backend, and Frontend:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Database: localhost:5432

### 4. Alternative: Manual Setup

#### Start Database and Redis

```bash
docker-compose -f docker-compose.dev.yml up -d postgres redis
```

#### Install Backend Dependencies

```bash
cd backend
npm install
```

#### Run Database Migrations

```bash
# The database will be initialized automatically on first connection
# The init.sql script creates all tables and sample data
```

#### Start Backend Server

```bash
npm run dev
```

Backend will run on http://localhost:8000

#### Install Frontend Dependencies

```bash
cd ..  # Back to root
npm install
```

#### Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Using the Application

### 1. Register a New User

1. Navigate to http://localhost:3000/register
2. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: +2348012345678
   - Password: SecurePass123!
   - Confirm Password: SecurePass123!
3. Click "Create Account"

### 2. Verify Email

1. Check your terminal/console for the email OTP code
   ```
   📧 OTP Email for john@example.com: 123456
   ```
2. Enter the 6-digit code
3. Click "Verify Email"

### 3. Verify Phone

1. Check your terminal/console for the phone OTP code
   ```
   📱 OTP SMS for +2348012345678: 654321
   ```
2. Enter the 6-digit code
3. Click "Complete Registration"

### 4. Automatic Login

After successful verification, you'll be automatically logged in and redirected to the dashboard.

## Testing with Sample Data

A test user is created automatically:

- **Email:** test@nairavault.com
- **Password:** Test@123
- **Phone:** +2348012345678

You can use this account to login directly at http://localhost:3000/login

## Development Tips

### Check Logs

**Backend Logs:**
```bash
# Application logs
tail -f backend/logs/combined.log

# Error logs
tail -f backend/logs/error.log
```

**Docker Logs:**
```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f backend
```

### Database Access

**Connect to PostgreSQL:**
```bash
docker exec -it naira-vault-postgres psql -U naira_vault -d naira_vault_db
```

**Useful SQL Queries:**
```sql
-- View all users
SELECT id, email, phone, email_verified, phone_verified, created_at FROM users;

-- View OTP verifications
SELECT * FROM otp_verifications ORDER BY created_at DESC LIMIT 10;

-- View user's wallets
SELECT w.* FROM wallets w 
JOIN users u ON w.user_id = u.id 
WHERE u.email = 'test@nairavault.com';
```

### Redis Access

**Connect to Redis:**
```bash
docker exec -it naira-vault-redis redis-cli
```

**Useful Redis Commands:**
```bash
# List all keys
KEYS *

# Get a specific key
GET key_name

# Flush all data (careful!)
FLUSHALL
```

## API Testing

### Using cURL

**Register User:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "phone": "+2348087654321",
    "password": "SecurePass123!",
    "firstName": "Jane",
    "lastName": "Smith",
    "accountType": "individual"
  }'
```

**Verify Email OTP:**
```bash
curl -X POST http://localhost:8000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "otpCode": "123456",
    "otpType": "email"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@nairavault.com",
    "password": "Test@123"
  }'
```

### Using Postman

Import the API collection:
1. Open Postman
2. Import → Link → `http://localhost:8000/api/docs/postman` (coming soon)
3. Set base URL to `http://localhost:8000/api`

## Troubleshooting

### Issue: Database Connection Failed

**Solution:**
```bash
# Ensure PostgreSQL is running
docker-compose -f docker-compose.dev.yml up -d postgres

# Check PostgreSQL logs
docker-compose -f docker-compose.dev.yml logs postgres

# Verify DATABASE_URL in backend/.env
```

### Issue: Redis Connection Failed

**Solution:**
```bash
# Ensure Redis is running
docker-compose -f docker-compose.dev.yml up -d redis

# Check Redis logs
docker-compose -f docker-compose.dev.yml logs redis
```

### Issue: OTP Emails Not Sending

**Solution:**
- In development mode, OTP codes are logged to console
- Check terminal output for OTP codes
- For production, configure SMTP settings in `.env`

### Issue: Frontend Can't Connect to Backend

**Solution:**
```bash
# Ensure backend is running on port 8000
# Check VITE_API_URL in .env matches backend port
# Verify CORS settings in backend/src/index.js
```

### Issue: Port Already in Use

**Solution:**
```bash
# Find and kill process using the port
# For port 8000 (backend):
lsof -ti:8000 | xargs kill -9

# For port 3000 (frontend):
lsof -ti:3000 | xargs kill -9
```

## Next Steps

1. ✅ Complete user registration
2. 📱 Explore the dashboard
3. 💰 Create wallets for different currencies
4. 💸 Test transactions
5. 📊 View transaction history
6. 🔄 Try currency conversions
7. 📚 Read the full documentation

## Additional Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [User Registration Guide](./USER_REGISTRATION.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Development Setup](./DEVELOPMENT_SETUP.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

## Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review logs in `backend/logs/`
3. Ensure all environment variables are set
4. Verify Docker containers are running
5. Create an issue in the repository

## Clean Up

To stop and remove all containers:

```bash
docker-compose -f docker-compose.dev.yml down

# To also remove volumes (will delete database data):
docker-compose -f docker-compose.dev.yml down -v
```

---

Happy coding! 🚀

