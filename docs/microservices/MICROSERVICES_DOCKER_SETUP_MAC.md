# Microservices Setup on Docker Desktop for Mac - Step-by-Step Guide

## 📋 Overview

This guide provides complete step-by-step instructions to set up and run the Naira Vault Ledger microservices on Docker Desktop for Mac.

**Time Required:** 30-45 minutes  
**Difficulty:** Intermediate

---

## ✅ Prerequisites

### 1. **Check Your Mac Requirements**
```bash
# Check macOS version (should be 10.15 or higher)
sw_vers

# Check available disk space (need at least 10GB free)
df -h

# Check RAM (recommend 8GB+)
sysctl hw.memsize | awk '{print $2/1073741824 " GB"}'
```

### 2. **Install Required Software**

#### **Docker Desktop for Mac**

**Download and Install:**
1. Go to https://www.docker.com/products/docker-desktop
2. Download "Docker Desktop for Mac"
3. Open the downloaded `.dmg` file
4. Drag Docker to Applications folder
5. Launch Docker from Applications

**Verify Installation:**
```bash
# Check Docker version
docker --version
# Should show: Docker version 24.x.x or higher

# Check Docker Compose
docker-compose --version
# Should show: Docker Compose version 2.x.x or higher

# Check Docker is running
docker ps
# Should show empty list (no error)
```

#### **Node.js (if not installed)**
```bash
# Check if Node.js is installed
node --version
# Should show: v18.x.x or higher

# If not installed, install via Homebrew:
brew install node

# Or download from https://nodejs.org
```

---

## 🚀 Step-by-Step Setup

### **Step 1: Prepare Your Environment**

#### **1.1 Open Terminal**
```bash
# Navigate to project directory
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger

# Verify you're in the right directory
pwd
# Should show: /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger

ls
# Should see: backend/, services/, src/, docs/, docker-compose files
```

#### **1.2 Start Docker Desktop**
```bash
# Make sure Docker Desktop is running
open -a Docker

# Wait for Docker to fully start (Docker icon in menu bar should be running)
# This may take 1-2 minutes

# Verify Docker is ready
docker info
# Should show Docker information without errors
```

---

### **Step 2: Stop Any Running Services**

```bash
# Stop monolithic backend if running
# (Press Ctrl+C in the terminal where it's running)

# Stop any existing Docker containers
docker-compose -f docker-compose.dev.yml down

# Stop frontend if running
# (Press Ctrl+C in the terminal where it's running)

# Verify no containers running on our ports
lsof -i :3000  # Frontend (should show nothing)
lsof -i :8000  # API Gateway (should show nothing)

# If anything is running, kill it:
# lsof -ti:3000 | xargs kill -9
# lsof -ti:8000 | xargs kill -9
```

---

### **Step 3: Install Shared Dependencies**

```bash
# Navigate to shared libraries
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/services/shared

# Install dependencies
npm install

# Expected output: 
# added XXX packages in XXs

# Verify installation
ls node_modules/
# Should see: winston, pg, redis, amqplib, etc.

# Go back to root
cd ../..
```

---

### **Step 4: Install Service Dependencies**

```bash
# API Gateway
cd services/api-gateway
npm install
cd ../..

# Auth Service
cd services/auth-service
npm install
cd ../..

# Notification Service
cd services/notification-service
npm install
cd ../..

# User Service
cd services/user-service
npm install
cd ../..

# Wallet Service
cd services/wallet-service
npm install
cd ../..

# Transaction Service
cd services/transaction-service
npm install
cd ../..

# Currency Service
cd services/currency-service
npm install
cd ../..

# Verify you're back in root
pwd
# Should show: /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger
```

**Note:** This step takes 3-5 minutes. Each `npm install` installs service dependencies.

---

### **Step 5: Configure Docker Desktop**

#### **5.1 Allocate Resources**
1. Click Docker icon in menu bar
2. Select "Preferences" or "Settings"
3. Go to "Resources"
4. Set recommended values:
   - **CPUs:** 4 (minimum 2)
   - **Memory:** 8GB (minimum 4GB)
   - **Swap:** 2GB
   - **Disk:** 60GB
5. Click "Apply & Restart"
6. Wait for Docker to restart

#### **5.2 Enable Kubernetes (Optional)**
Not required for this setup, but good to have:
1. Go to "Kubernetes" in Docker settings
2. Check "Enable Kubernetes"
3. Click "Apply & Restart"

---

### **Step 6: Build Docker Images**

```bash
# Make sure you're in the project root
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger

# Build all services
# This command builds Docker images for all 7 microservices
docker-compose -f docker-compose.microservices.yml build

# Expected output:
# Building api-gateway...
# Building auth-service...
# Building notification-service...
# Building user-service...
# Building wallet-service...
# Building transaction-service...
# Building currency-service...
# Building frontend...

# This takes 5-10 minutes on first build
# Subsequent builds are faster (cached)
```

**What's happening:**
- Docker is building separate images for each service
- Each service gets its own container
- Shared libraries are copied into each service
- Dependencies are installed in each container

---

### **Step 7: Start the Microservices**

```bash
# Start all services
docker-compose -f docker-compose.microservices.yml up -d

# The -d flag runs in detached mode (background)

# Expected output:
# Creating network "naira-vault-network-ms"...
# Creating naira-vault-postgres-ms...
# Creating naira-vault-redis-ms...
# Creating naira-vault-rabbitmq-ms...
# Creating naira-vault-notification-service...
# Creating naira-vault-auth-service...
# Creating naira-vault-user-service...
# Creating naira-vault-wallet-service...
# Creating naira-vault-transaction-service...
# Creating naira-vault-currency-service...
# Creating naira-vault-api-gateway...
# Creating naira-vault-frontend-ms...
```

**Wait 30-60 seconds** for all services to start and initialize.

---

### **Step 8: Verify Services Are Running**

#### **8.1 Check Docker Containers**
```bash
# List all running containers
docker ps

# You should see 11 containers:
# 1. postgres
# 2. redis
# 3. rabbitmq
# 4. api-gateway
# 5. auth-service
# 6. notification-service
# 7. user-service
# 8. wallet-service
# 9. transaction-service
# 10. currency-service
# 11. frontend

# Format for easier reading
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

#### **8.2 Check Service Health**
```bash
# Check API Gateway health
curl http://localhost:8000/health

# Expected output:
# {"status":"OK","service":"api-gateway","timestamp":"...","uptime":...}

# Check all services health
curl http://localhost:8000/health/services

# Expected output: JSON showing all services UP
```

#### **8.3 View Service Logs**
```bash
# View all logs
docker-compose -f docker-compose.microservices.yml logs

# View logs in real-time (follow mode)
docker-compose -f docker-compose.microservices.yml logs -f

# View specific service logs
docker-compose -f docker-compose.microservices.yml logs auth-service

# View last 50 lines
docker-compose -f docker-compose.microservices.yml logs --tail=50
```

---

### **Step 9: Access the Application**

#### **9.1 Open Frontend**
```bash
# Open in browser
open http://localhost:3000

# Or manually visit:
# http://localhost:3000
```

You should see the **Landing Page**!

#### **9.2 Test Registration**
1. Click "Get Started" or "Create Account"
2. Fill in the registration form:
   ```
   First Name: Test
   Last Name: Micro
   Email: micro@test.com
   Phone: +2348012345678
   Password: Test@123456
   Confirm Password: Test@123456
   ```
3. Click "Create Account"

#### **9.3 Get OTP Codes**

**Option 1: Check Auth Service Logs**
```bash
# In a new terminal
docker-compose -f docker-compose.microservices.yml logs -f auth-service

# Look for lines like:
# 📧 OTP Email for micro@test.com: 123456
# 📱 OTP SMS for +2348012345678: 654321
```

**Option 2: Check Notification Service Logs**
```bash
docker-compose -f docker-compose.microservices.yml logs -f notification-service

# Look for OTP codes
```

#### **9.4 Complete Verification**
1. Enter **Email OTP** (6 digits from logs)
2. Click "Verify Email"
3. Enter **Phone OTP** (6 digits from logs)
4. Click "Complete Registration"
5. You'll be logged in and redirected to dashboard!

---

### **Step 10: Verify Microservices Architecture**

#### **10.1 Check Individual Services**
```bash
# Auth Service
curl http://localhost:8001/health

# User Service
curl http://localhost:8002/health

# Wallet Service
curl http://localhost:8003/health

# Transaction Service
curl http://localhost:8004/health

# Currency Service
curl http://localhost:8005/health

# Notification Service
curl http://localhost:8006/health
```

All should return `{"status":"OK",...}`

#### **10.2 Check RabbitMQ Management**
```bash
# Open RabbitMQ Management UI
open http://localhost:15672

# Login credentials:
# Username: naira_vault
# Password: naira_vault_password
```

You should see the RabbitMQ dashboard showing queues and exchanges.

#### **10.3 Check Database**
```bash
# Connect to PostgreSQL
docker exec -it naira-vault-postgres-ms psql -U naira_vault -d naira_vault_db

# Once connected, run:
\dt                              # List all tables
SELECT COUNT(*) FROM users;      # Check users table
\q                               # Quit
```

---

## 🔧 Common Commands

### **Start Services**
```bash
# Start all services
docker-compose -f docker-compose.microservices.yml up -d

# Start specific service
docker-compose -f docker-compose.microservices.yml up -d auth-service

# Start with live logs
docker-compose -f docker-compose.microservices.yml up
```

### **Stop Services**
```bash
# Stop all services
docker-compose -f docker-compose.microservices.yml down

# Stop but keep volumes (preserves database data)
docker-compose -f docker-compose.microservices.yml stop

# Stop and remove volumes (fresh start)
docker-compose -f docker-compose.microservices.yml down -v
```

### **Restart Services**
```bash
# Restart all services
docker-compose -f docker-compose.microservices.yml restart

# Restart specific service
docker-compose -f docker-compose.microservices.yml restart auth-service

# Rebuild and restart specific service
docker-compose -f docker-compose.microservices.yml up -d --build auth-service
```

### **View Logs**
```bash
# All services
docker-compose -f docker-compose.microservices.yml logs -f

# Specific service
docker-compose -f docker-compose.microservices.yml logs -f auth-service

# Multiple services
docker-compose -f docker-compose.microservices.yml logs -f auth-service notification-service

# Last 100 lines
docker-compose -f docker-compose.microservices.yml logs --tail=100
```

### **Check Status**
```bash
# List running containers
docker-compose -f docker-compose.microservices.yml ps

# Check resource usage
docker stats

# Check specific container
docker inspect naira-vault-auth-service
```

---

## 🐛 Troubleshooting

### **Issue 1: Docker Desktop Not Starting**

**Solution:**
```bash
# Quit Docker Desktop
# Open Activity Monitor
# Search for "Docker"
# Force quit any Docker processes
# Restart Docker Desktop

# If still issues, reset Docker
# Docker Desktop → Preferences → Troubleshoot → Reset to factory defaults
```

### **Issue 2: Port Already in Use**

**Error:** `Bind for 0.0.0.0:8000 failed: port is already allocated`

**Solution:**
```bash
# Find what's using the port
lsof -i :8000

# Kill the process
lsof -ti:8000 | xargs kill -9

# Or stop monolithic backend if running
cd backend
# Press Ctrl+C

# Then restart microservices
docker-compose -f docker-compose.microservices.yml up -d
```

### **Issue 3: Build Fails**

**Error:** `failed to solve: error from sender`

**Solution:**
```bash
# Clean Docker build cache
docker builder prune -a

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Rebuild from scratch
docker-compose -f docker-compose.microservices.yml build --no-cache
```

### **Issue 4: Service Won't Start**

**Solution:**
```bash
# Check service logs
docker-compose -f docker-compose.microservices.yml logs auth-service

# Check if database is ready
docker-compose -f docker-compose.microservices.yml logs postgres

# Wait for database initialization (first start)
sleep 30

# Restart the failing service
docker-compose -f docker-compose.microservices.yml restart auth-service
```

### **Issue 5: Database Connection Failed**

**Error:** `ECONNREFUSED` or `getaddrinfo ENOTFOUND postgres`

**Solution:**
```bash
# Ensure PostgreSQL is running
docker-compose -f docker-compose.microservices.yml ps postgres

# Check PostgreSQL logs
docker-compose -f docker-compose.microservices.yml logs postgres

# Restart PostgreSQL
docker-compose -f docker-compose.microservices.yml restart postgres

# Wait 10 seconds
sleep 10

# Restart dependent services
docker-compose -f docker-compose.microservices.yml restart
```

### **Issue 6: Out of Memory**

**Error:** Services keep restarting or crashing

**Solution:**
1. Open Docker Desktop
2. Go to Preferences → Resources
3. Increase Memory to 8GB
4. Click Apply & Restart
5. Wait for Docker to restart
6. Start services again

### **Issue 7: Cannot Access Frontend**

**Solution:**
```bash
# Check if frontend container is running
docker ps | grep frontend

# Check frontend logs
docker-compose -f docker-compose.microservices.yml logs frontend

# Restart frontend
docker-compose -f docker-compose.microservices.yml restart frontend

# Wait 10 seconds
sleep 10

# Access http://localhost:3000
```

---

## 🧪 Testing the Microservices

### **Test 1: Service Health Check**

```bash
# Check all services are healthy
curl http://localhost:8000/health/services | python3 -m json.tool

# Expected output:
# {
#   "status": "OK",
#   "services": {
#     "auth": { "status": "UP", "url": "..." },
#     "user": { "status": "UP", "url": "..." },
#     "wallet": { "status": "UP", "url": "..." },
#     ...
#   }
# }
```

### **Test 2: Registration Flow**

```bash
# Test registration through API Gateway
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+2348012345678",
    "password": "Test@123456",
    "firstName": "Test",
    "lastName": "User",
    "accountType": "individual"
  }' | python3 -m json.tool

# Expected response:
# {
#   "success": true,
#   "data": {
#     "userId": "...",
#     "email": "test@example.com",
#     ...
#   }
# }
```

### **Test 3: Check Service Communication**

```bash
# Check auth service directly
curl http://localhost:8001/health

# Check notification service directly  
curl http://localhost:8006/health

# All should return healthy status
```

### **Test 4: Check RabbitMQ Events**

1. Open http://localhost:15672
2. Login (naira_vault / naira_vault_password)
3. Click "Queues" tab
4. You should see queues created by services
5. Register a user in the app
6. Watch messages flow through queues

---

## 📊 Monitoring Your Microservices

### **Docker Desktop Dashboard**

1. Open Docker Desktop application
2. Click "Containers" in left sidebar
3. You'll see all 11 containers
4. Click any container to see:
   - Logs
   - Stats (CPU, Memory)
   - Inspect
   - Terminal access

### **Service Logs in Real-Time**

```bash
# Open multiple terminals and run:

# Terminal 1: API Gateway logs
docker-compose -f docker-compose.microservices.yml logs -f api-gateway

# Terminal 2: Auth Service logs
docker-compose -f docker-compose.microservices.yml logs -f auth-service

# Terminal 3: Notification Service logs
docker-compose -f docker-compose.microservices.yml logs -f notification-service

# Terminal 4: All service logs combined
docker-compose -f docker-compose.microservices.yml logs -f
```

### **Resource Usage**

```bash
# Check container resource usage
docker stats

# Shows:
# - CPU usage per container
# - Memory usage per container
# - Network I/O
# - Block I/O

# Press Ctrl+C to exit
```

---

## 🎯 Post-Setup Verification

### **Checklist:**

```bash
# ✅ Docker Desktop running
docker --version

# ✅ All containers running
docker ps | wc -l
# Should show 12 lines (11 containers + header)

# ✅ API Gateway responding
curl -s http://localhost:8000/health | grep "OK"

# ✅ Frontend accessible
curl -s http://localhost:3000 | grep "html"

# ✅ Services healthy
curl -s http://localhost:8000/health/services | grep "UP"

# ✅ Database ready
docker exec naira-vault-postgres-ms pg_isready -U naira_vault

# ✅ Redis ready
docker exec naira-vault-redis-ms redis-cli ping
# Should show: PONG

# ✅ RabbitMQ ready
docker exec naira-vault-rabbitmq-ms rabbitmq-diagnostics ping
# Should show: Ping succeeded
```

If all checks pass: ✅ **SYSTEM READY!**

---

## 🌐 Access Points

Once everything is running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | User interface |
| **API Gateway** | http://localhost:8000 | API entry point |
| **Service Health** | http://localhost:8000/health/services | Monitor services |
| **RabbitMQ UI** | http://localhost:15672 | Message queue dashboard |
| **Auth Service** | http://localhost:8001/health | Auth service (direct) |
| **User Service** | http://localhost:8002/health | User service (direct) |
| **Wallet Service** | http://localhost:8003/health | Wallet service (direct) |
| **Transaction Service** | http://localhost:8004/health | Transaction service (direct) |
| **Currency Service** | http://localhost:8005/health | Currency service (direct) |
| **Notification Service** | http://localhost:8006/health | Notification service (direct) |

---

## 🔄 Daily Workflow

### **Start Your Day:**
```bash
# 1. Start Docker Desktop
open -a Docker

# 2. Wait for Docker to be ready (30 seconds)
sleep 30

# 3. Start microservices
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger
docker-compose -f docker-compose.microservices.yml up -d

# 4. Verify services are up
curl http://localhost:8000/health/services

# 5. Open application
open http://localhost:3000
```

### **During Development:**
```bash
# View logs of service you're working on
docker-compose -f docker-compose.microservices.yml logs -f auth-service

# Restart service after code changes
docker-compose -f docker-compose.microservices.yml restart auth-service

# Rebuild if you changed Dockerfile or dependencies
docker-compose -f docker-compose.microservices.yml up -d --build auth-service
```

### **End of Day:**
```bash
# Option 1: Stop but keep data
docker-compose -f docker-compose.microservices.yml stop

# Option 2: Stop and remove containers (keeps images)
docker-compose -f docker-compose.microservices.yml down

# Option 3: Complete cleanup (removes everything)
docker-compose -f docker-compose.microservices.yml down -v
docker system prune -a
```

---

## 🔧 Advanced Configuration

### **Environment Variables**

Create environment file for microservices:
```bash
# Create .env file for Docker Compose
cat > .env.microservices << 'EOF'
# SMTP Configuration (optional for production)
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# SMS Configuration (optional for production)
SMS_API_KEY=your_termii_api_key

# Exchange Rate API (optional)
EXCHANGE_RATE_API_KEY=your_api_key
EOF

# Use in Docker Compose
docker-compose -f docker-compose.microservices.yml --env-file .env.microservices up -d
```

### **Custom Ports**

If you need to change ports, edit `docker-compose.microservices.yml`:
```yaml
services:
  api-gateway:
    ports:
      - "9000:8000"  # Change 9000 to your preferred port
```

### **Resource Limits**

Add to service definition in `docker-compose.microservices.yml`:
```yaml
services:
  auth-service:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M
```

---

## 📊 Performance Optimization

### **For Development:**
```bash
# Use local DNS cache
# Add to /etc/hosts:
127.0.0.1 postgres redis rabbitmq

# Mount code for hot reload (already configured in frontend)
```

### **For Production:**
```bash
# Build optimized images
docker-compose -f docker-compose.microservices.yml build --no-cache

# Use production environment
NODE_ENV=production docker-compose -f docker-compose.microservices.yml up -d

# Enable health check restarts
# (already configured in docker-compose file)
```

---

## 🎓 Understanding the Setup

### **What Docker Compose Does:**

1. **Creates Network:** `naira-vault-network-ms`
   - All services can communicate
   - DNS resolution by service name
   - Isolated from host network

2. **Starts Infrastructure:**
   - PostgreSQL (database)
   - Redis (cache)
   - RabbitMQ (message queue)

3. **Builds Service Images:**
   - One image per service
   - Based on Dockerfiles
   - Includes dependencies

4. **Starts Containers:**
   - One container per service
   - Environment variables injected
   - Ports mapped to host

5. **Service Discovery:**
   - Services find each other by name
   - `http://auth-service:8001`
   - Docker DNS handles resolution

### **Container Lifecycle:**

```
Build Image → Create Container → Start Container → Run Service
    ↓              ↓                  ↓                ↓
Dockerfile    docker create      docker start     Service runs
              (from image)       (container)      (healthcheck)
```

---

## 🎯 Quick Reference Card

### **Essential Commands:**
```bash
# Start
docker-compose -f docker-compose.microservices.yml up -d

# Stop
docker-compose -f docker-compose.microservices.yml down

# Logs
docker-compose -f docker-compose.microservices.yml logs -f

# Status
docker-compose -f docker-compose.microservices.yml ps

# Health
curl http://localhost:8000/health/services

# Restart
docker-compose -f docker-compose.microservices.yml restart

# Rebuild
docker-compose -f docker-compose.microservices.yml up -d --build
```

---

## 📱 Screenshots Guide (What to Expect)

### **Docker Desktop:**
```
You should see in "Containers" section:
├── naira-vault-ledger-microservices
│   ├── naira-vault-api-gateway (green, running)
│   ├── naira-vault-auth-service (green, running)
│   ├── naira-vault-notification-service (green, running)
│   ├── naira-vault-user-service (green, running)
│   ├── naira-vault-wallet-service (green, running)
│   ├── naira-vault-transaction-service (green, running)
│   ├── naira-vault-currency-service (green, running)
│   ├── naira-vault-postgres-ms (green, running)
│   ├── naira-vault-redis-ms (green, running)
│   ├── naira-vault-rabbitmq-ms (green, running)
│   └── naira-vault-frontend-ms (green, running)
```

### **Browser:**
```
http://localhost:3000 → Landing Page
http://localhost:3000/register → Registration Form
http://localhost:3000/login → Login Page
http://localhost:3000/dashboard → Dashboard (after login)
```

---

## ⏱️ Estimated Times

| Task | Time |
|------|------|
| Install Docker Desktop | 5 minutes |
| Install service dependencies | 5 minutes |
| Build Docker images (first time) | 10 minutes |
| Start all services | 2 minutes |
| Verify setup | 3 minutes |
| **Total** | **~25 minutes** |

Subsequent starts: ~2 minutes (images are cached)

---

## 🎉 Success Criteria

You know the setup is successful when:

✅ Docker Desktop shows 11 green containers  
✅ `curl http://localhost:8000/health` returns OK  
✅ `http://localhost:3000` shows landing page  
✅ Can register a new user  
✅ Receive OTP codes in logs  
✅ Can complete verification  
✅ Can login and see dashboard  
✅ RabbitMQ UI accessible at http://localhost:15672  

---

## 📞 Getting Help

### **If Services Won't Start:**
1. Check Docker Desktop is running
2. Check resource allocation (8GB RAM minimum)
3. View service logs for errors
4. Check port conflicts
5. Try clean rebuild

### **If Can't Access Application:**
1. Verify containers are running (`docker ps`)
2. Check frontend container logs
3. Verify API Gateway is accessible
4. Check browser console for errors
5. Try different browser

### **If Database Issues:**
1. Check PostgreSQL container running
2. View PostgreSQL logs
3. Wait for initialization (30 seconds first time)
4. Verify connection string in services
5. Try restart PostgreSQL container

---

## 🔄 Switching Back to Monolith

If you want to switch back to the monolithic backend:

```bash
# 1. Stop microservices
docker-compose -f docker-compose.microservices.yml down

# 2. Start monolith infrastructure
docker-compose -f docker-compose.dev.yml up -d postgres redis

# 3. Start monolith backend
cd backend
npm run dev

# 4. Start frontend (new terminal)
cd ..
npm run dev

# 5. Access
open http://localhost:3000
```

Both systems use the same frontend, so no changes needed!

---

## 📚 Next Steps

After successful setup:

1. **Test Registration:**
   - Create a new account
   - Verify email and phone
   - Login to dashboard

2. **Explore Services:**
   - Check RabbitMQ UI
   - View service logs
   - Monitor Docker Desktop

3. **Read Documentation:**
   - [MICROSERVICES_ARCHITECTURE.md](./MICROSERVICES_ARCHITECTURE.md)
   - [HYBRID_DEPLOYMENT_GUIDE.md](./HYBRID_DEPLOYMENT_GUIDE.md)
   - [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

4. **Development:**
   - Make changes to services
   - Test service communication
   - Explore event-driven features

---

## ✨ Summary

**Setup Steps:**
1. ✅ Install Docker Desktop
2. ✅ Navigate to project directory
3. ✅ Install dependencies (npm install in services)
4. ✅ Build Docker images
5. ✅ Start all services
6. ✅ Verify health
7. ✅ Test application
8. ✅ Monitor logs

**Result:**
- 11 Docker containers running
- 7 microservices operational
- API Gateway routing requests
- RabbitMQ handling events
- Complete system functional

**Time:** ~25 minutes for first setup, ~2 minutes for subsequent starts

---

## 🎊 Congratulations!

You now have a **fully functional microservices architecture** running on Docker Desktop for Mac!

**What you can do:**
- ✅ Register users through microservices
- ✅ Services communicate independently
- ✅ Events flow through RabbitMQ
- ✅ Each service can scale independently
- ✅ Monitor all services in Docker Desktop
- ✅ Switch back to monolith anytime

**Next:** Start developing features and scaling services as needed!

---

**Created:** October 23, 2025  
**For:** macOS with Docker Desktop  
**Status:** Complete and tested  
**Support:** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

🚀 **Happy Microservicing!**

