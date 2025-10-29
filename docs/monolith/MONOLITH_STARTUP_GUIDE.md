# 🚀 Monolithic Backend - Startup Guide

## 📋 Overview

This guide shows you how to start the **Naira Vault Ledger monolithic backend** on your Mac.

**Time Required:** 5 minutes  
**Difficulty:** Easy  
**Status:** ✅ Production-ready and fully functional

---

## ✅ Prerequisites

### **Required Software:**
- ✅ Node.js 18+ installed
- ✅ Docker Desktop installed and running
- ✅ Git (for cloning)

### **Verify Prerequisites:**
```bash
# Check Node.js
node --version
# Should show: v18.x.x or higher

# Check npm
npm --version
# Should show: 9.x.x or higher

# Check Docker
docker --version
# Should show: Docker version 24.x.x or higher

# Check Docker is running
docker ps
# Should show empty list or running containers (no error)
```

---

## 🚀 Step-by-Step Startup

### **Step 1: Navigate to Project Directory**

```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger

# Verify you're in the right place
pwd
# Should show: /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger

ls
# Should see: backend/, src/, docs/, README.md
```

---

### **Step 2: Start Infrastructure Services**

```bash
# Start PostgreSQL and Redis using Docker
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Expected output:
# Creating network "naira-vault-ledger_naira-vault-network"
# Creating naira-vault-ledger-postgres-1
# Creating naira-vault-ledger-redis-1

# Wait 10 seconds for services to initialize
sleep 10

# Verify services are running
docker ps

# You should see:
# - naira-vault-ledger-postgres-1 (port 5444)
# - naira-vault-ledger-redis-1 (port 6379)
```

**What this does:**
- Starts PostgreSQL database on port 5444
- Starts Redis cache on port 6379
- Both run in Docker containers
- Data persists across restarts

---

### **Step 3: Install Backend Dependencies** (First time only)

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# Expected output:
# added XXX packages in XXs

# This installs:
# - express, cors, helmet
# - bcryptjs, jsonwebtoken
# - nodemailer, axios
# - winston, joi, pg, redis
# - And all other dependencies
```

**Note:** Only needed once. Skip this step on subsequent startups.

---

### **Step 4: Configure Environment** (First time only)

```bash
# Still in backend directory
# Check if .env exists
ls -la .env

# If it doesn't exist, create it:
cat > .env << 'EOF'
NODE_ENV=development
PORT=8000

# Database
DATABASE_URL=postgresql://naira_vault:naira_vault_password@localhost:5444/naira_vault_db
DB_HOST=localhost
DB_PORT=5444
DB_NAME=naira_vault_db
DB_USER=naira_vault
DB_PASSWORD=naira_vault_password

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=7d

# Password Hashing
BCRYPT_ROUNDS=12

# CORS
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=debug
EOF

# Verify .env was created
cat .env
```

**Note:** Only needed once. The file persists.

---

### **Step 5: Start Backend Server**

```bash
# Make sure you're in the backend directory
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/backend

# Start the development server
npm run dev

# Expected output:
# [nodemon] starting `node src/index.js`
# Starting Naira Vault Backend...
# Loading routes...
# Routes loaded successfully
# Setting up middleware...
# API routes configured
# info: Database connection established
# info: PostgreSQL database connected successfully
# info: Redis client connected
# info: Redis client ready
# ==================================================
# 🚀 Server running on port 8000
# 📍 API URL: http://localhost:8000/api
# 🏥 Health: http://localhost:8000/health
# 🌍 Environment: development
# ==================================================
```

**✅ Backend is now running!**

**What this does:**
- Starts Express server on port 8000
- Connects to PostgreSQL
- Connects to Redis
- Loads all routes
- Watches for file changes (auto-restart)

---

### **Step 6: Start Frontend** (New Terminal)

```bash
# Open a NEW terminal window
# Navigate to project root
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger

# Create .env for frontend if it doesn't exist
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Install frontend dependencies (first time only)
npm install

# Start frontend development server
npm run dev

# Expected output:
#   VITE v5.x.x  ready in XXX ms
#
#   ➜  Local:   http://localhost:3000/
#   ➜  Network: use --host to expose
#   ➜  press h + enter to show help
```

**✅ Frontend is now running!**

---

### **Step 7: Access the Application**

```bash
# Open in your default browser
open http://localhost:3000

# Or manually visit:
# http://localhost:3000
```

**You should see the Naira Vault Landing Page!** 🎉

---

## 🎯 Verify Everything is Working

### **Check Backend Health:**
```bash
# In a new terminal
curl http://localhost:8000/health

# Expected response:
# {"status":"OK","timestamp":"...","uptime":...,"environment":"development"}
```

### **Check Database Connection:**
```bash
# Connect to PostgreSQL
docker exec -it naira-vault-ledger-postgres-1 psql -U naira_vault -d naira_vault_db

# Once connected, run:
\dt                    # List tables
SELECT COUNT(*) FROM users;
\q                     # Quit
```

### **Check Redis:**
```bash
# Connect to Redis
docker exec -it naira-vault-ledger-redis-1 redis-cli

# Once connected:
PING                   # Should return PONG
KEYS *                 # List all keys
EXIT                   # Quit
```

---

## 🧪 Test the Application

### **Test 1: Landing Page**
```bash
# Visit
open http://localhost:3000/landing

# Should show marketing page with:
# - Hero section
# - Features grid
# - How it works
# - Call-to-action buttons
```

### **Test 2: Registration**

1. **Navigate to Registration:**
   - Click "Get Started" or visit http://localhost:3000/register

2. **Fill in Form:**
   ```
   First Name: Test
   Last Name: User
   Email: test@example.com
   Phone: +2348012345678
   Password: Test@123456
   Confirm Password: Test@123456
   ```

3. **Submit Form**

4. **Check Backend Terminal for OTP Codes:**
   ```
   📧 OTP Email for test@example.com: 123456
   📱 OTP SMS for +2348012345678: 654321
   ```

5. **Complete Verification:**
   - Enter Email OTP: `123456`
   - Click "Verify Email"
   - Enter Phone OTP: `654321`
   - Click "Complete Registration"

6. **Success!**
   - You'll be automatically logged in
   - Redirected to dashboard
   - See personalized welcome message

### **Test 3: Login**

1. **Logout** (click avatar → Log out)
2. **Login** at http://localhost:3000/login
3. **Use Credentials:**
   - Email: test@example.com
   - Password: Test@123456
4. **Should redirect to dashboard**

### **Test 4: Protected Routes**

1. **Clear browser session:**
   - Open DevTools (F12)
   - Application → Local Storage
   - Clear `auth_token`
   - Refresh page

2. **Try accessing dashboard:**
   - Visit http://localhost:3000/dashboard
   - Should redirect to /landing (protected!)

3. **Login again:**
   - Access granted to dashboard

---

## 🛑 Stop the Application

### **Stop Backend:**
```bash
# In the terminal running backend
# Press: Ctrl + C

# Backend will shut down gracefully
```

### **Stop Frontend:**
```bash
# In the terminal running frontend
# Press: Ctrl + C

# Frontend dev server will stop
```

### **Stop Infrastructure:**
```bash
# From project root
docker-compose -f docker-compose.dev.yml down

# This stops:
# - PostgreSQL
# - Redis

# To also remove data volumes:
docker-compose -f docker-compose.dev.yml down -v
```

---

## 🔄 Daily Workflow

### **Morning (Start Work):**
```bash
# Terminal 1: Start infrastructure
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Terminal 2: Start backend
cd backend
npm run dev

# Terminal 3: Start frontend
cd ..
npm run dev

# Open browser
open http://localhost:3000
```

### **Evening (End Work):**
```bash
# Terminal 2 (backend): Ctrl+C
# Terminal 3 (frontend): Ctrl+C

# Stop Docker (optional - can leave running)
docker-compose -f docker-compose.dev.yml stop
```

---

## 🐛 Troubleshooting

### **Issue: Backend Won't Start**

**Error:** `Database connection failed`

**Solution:**
```bash
# Ensure PostgreSQL is running
docker ps | grep postgres

# If not running:
docker-compose -f docker-compose.dev.yml up -d postgres

# Wait 10 seconds
sleep 10

# Try starting backend again
cd backend && npm run dev
```

---

**Error:** `Redis connection failed`

**Solution:**
```bash
# Ensure Redis is running
docker ps | grep redis

# If not running:
docker-compose -f docker-compose.dev.yml up -d redis

# Try starting backend again
cd backend && npm run dev
```

---

**Error:** `Port 8000 already in use`

**Solution:**
```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process
lsof -ti:8000 | xargs kill -9

# Try starting backend again
cd backend && npm run dev
```

---

### **Issue: Frontend Won't Start**

**Error:** `Port 3000 already in use`

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Try starting frontend again
npm run dev
```

---

**Error:** `Cannot find module`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

---

### **Issue: OTP Codes Not Showing**

**Check:**
```bash
# Make sure you're watching the backend terminal
# OTP codes appear there in development mode

# Look for lines like:
# 📧 OTP Email for user@example.com: 123456
# 📱 OTP SMS for +234...: 654321
```

---

### **Issue: Database Tables Missing**

**Solution:**
```bash
# Recreate database with fresh schema
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d postgres

# Wait 15 seconds for initialization
sleep 15

# Tables are created automatically from init.sql
```

---

## 📊 What's Running

When everything is started:

| Service | Port | URL | Status |
|---------|------|-----|--------|
| **Frontend** | 3000 | http://localhost:3000 | ✅ Running |
| **Backend API** | 8000 | http://localhost:8000/api | ✅ Running |
| **PostgreSQL** | 5444 | localhost:5444 | ✅ Running (Docker) |
| **Redis** | 6379 | localhost:6379 | ✅ Running (Docker) |

---

## 🌐 Application URLs

| Page | URL | Description |
|------|-----|-------------|
| **Landing** | http://localhost:3000/landing | Marketing page |
| **Register** | http://localhost:3000/register | User registration |
| **Login** | http://localhost:3000/login | User login |
| **Dashboard** | http://localhost:3000/dashboard | User dashboard (protected) |
| **API Health** | http://localhost:8000/health | Backend health check |
| **Documentation** | http://localhost:3000/documentation | System documentation |

---

## 📝 Development Tips

### **Hot Reload:**
- **Backend:** Nodemon watches for changes, auto-restarts
- **Frontend:** Vite hot-reloads on file changes
- **No need to restart manually!**

### **View Logs:**
```bash
# Backend logs in terminal where it's running

# Or view log files:
tail -f backend/logs/combined.log   # All logs
tail -f backend/logs/error.log      # Errors only
```

### **Test API Endpoints:**
```bash
# Health check
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+2348012345678",
    "password": "Test@123456",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@nairavault.com",
    "password": "Test@123"
  }'
```

---

## ⚙️ Configuration

### **Backend Environment Variables** (`backend/.env`)

```env
NODE_ENV=development              # Environment
PORT=8000                         # Backend port

# Database (Docker container)
DATABASE_URL=postgresql://naira_vault:naira_vault_password@localhost:5444/naira_vault_db
DB_HOST=localhost
DB_PORT=5444                      # Note: 5444, not 5432!
DB_NAME=naira_vault_db
DB_USER=naira_vault
DB_PASSWORD=naira_vault_password

# Redis (Docker container)
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=7d

# Password Hashing
BCRYPT_ROUNDS=12

# CORS
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=debug                   # debug, info, warn, error
```

### **Frontend Environment Variables** (`.env`)

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 📊 System Architecture

```
┌─────────────┐
│  Browser    │
│  :3000      │
└──────┬──────┘
       │
       │ HTTP/REST
       │
┌──────▼──────┐      ┌──────────────┐
│  Backend    │─────▶│ PostgreSQL   │
│  Express.js │      │ Database     │
│  :8000      │      │ :5444        │
└──────┬──────┘      └──────────────┘
       │
       │
       ▼
┌─────────────┐
│   Redis     │
│   Cache     │
│   :6379     │
└─────────────┘
```

---

## 🎯 Features Available

Once started, you can:

✅ **Register new users** with email/phone OTP  
✅ **Login/Logout** with JWT authentication  
✅ **Access protected dashboard**  
✅ **View user profile**  
✅ **Manage sessions**  
✅ **Test all API endpoints**  

---

## 🔧 Advanced Options

### **Run in Production Mode:**
```bash
# Build for production
npm run build

# Start in production mode
NODE_ENV=production npm start
```

### **View Database:**
```bash
# Connect to PostgreSQL
docker exec -it naira-vault-ledger-postgres-1 psql -U naira_vault -d naira_vault_db

# Useful queries:
SELECT * FROM users;
SELECT * FROM otp_verifications ORDER BY created_at DESC LIMIT 5;
\dt                    # List all tables
\q                     # Quit
```

### **Clear Redis Cache:**
```bash
# Connect to Redis
docker exec -it naira-vault-ledger-redis-1 redis-cli

# Commands:
FLUSHALL              # Clear all cache
KEYS *                # List all keys
EXIT                  # Quit
```

### **Reset Database:**
```bash
# Stop and remove containers with volumes
docker-compose -f docker-compose.dev.yml down -v

# Start fresh
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Wait for initialization
sleep 15

# Database is recreated with init.sql
```

---

## 📱 Test Account

A test account is created automatically:

```
Email: test@nairavault.com
Password: Test@123
Phone: +2348012345678

Status: Fully verified, ready to login
```

Use this to test login without going through registration.

---

## 🎓 Understanding the Startup

### **What Happens When You Start:**

1. **Docker Compose:**
   - Creates network
   - Starts PostgreSQL container
   - Starts Redis container
   - Runs init.sql to create tables

2. **Backend (npm run dev):**
   - Nodemon starts Node.js
   - Loads environment variables
   - Imports all modules
   - Connects to PostgreSQL
   - Connects to Redis
   - Registers routes
   - Starts Express server on port 8000
   - Watches for file changes

3. **Frontend (npm run dev):**
   - Vite starts development server
   - Compiles React/TypeScript
   - Starts on port 3000
   - Enables hot module replacement (HMR)
   - Watches for file changes

---

## ⏱️ Estimated Times

| Task | First Time | Subsequent |
|------|------------|------------|
| Install backend dependencies | 2 min | N/A |
| Install frontend dependencies | 3 min | N/A |
| Start infrastructure | 30 sec | 10 sec |
| Start backend | 10 sec | 5 sec |
| Start frontend | 15 sec | 5 sec |
| **Total** | **~6 min** | **~30 sec** |

---

## 📚 Related Documentation

- **[START_HERE.md](./START_HERE.md)** - Quickest startup guide
- **[docs/QUICK_START.md](./docs/QUICK_START.md)** - Detailed quick start
- **[docs/DEVELOPMENT_SETUP.md](./docs/DEVELOPMENT_SETUP.md)** - Complete dev setup
- **[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Problem solving
- **[docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)** - API reference
- **[docs/USER_REGISTRATION.md](./docs/USER_REGISTRATION.md)** - Registration feature

---

## ✅ Startup Checklist

Before you start:
- [ ] Docker Desktop is running
- [ ] Node.js 18+ installed
- [ ] Project cloned/downloaded

First time setup:
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend `.env` file created
- [ ] Frontend `.env` file created

Every time startup:
- [ ] Infrastructure started (`docker-compose -f docker-compose.dev.yml up -d postgres redis`)
- [ ] Backend started (`cd backend && npm run dev`)
- [ ] Frontend started (`npm run dev`)
- [ ] Browser opened to http://localhost:3000

Verification:
- [ ] Backend shows "Server running on port 8000"
- [ ] Frontend shows "Local: http://localhost:3000"
- [ ] Landing page loads in browser
- [ ] Can register new user
- [ ] Can login
- [ ] Can access dashboard

---

## 🎊 Success!

When you see:

✅ **Backend Terminal:** "🚀 Server running on port 8000"  
✅ **Frontend Terminal:** "Local: http://localhost:3000"  
✅ **Browser:** Landing page loaded  

**You're ready to develop!** 🎉

---

## 📞 Need Help?

- **Quick issues:** Check [Troubleshooting](#troubleshooting) section above
- **Detailed help:** [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- **Features:** [docs/USER_REGISTRATION.md](./docs/USER_REGISTRATION.md)
- **API:** [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)

---

**Created:** October 28, 2025  
**Status:** Complete and tested  
**System:** Monolithic Backend  
**Platform:** macOS (also works on Linux, Windows)

🚀 **Happy coding with your working system!**

