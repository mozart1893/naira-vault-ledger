# 🔷 Microservices - Complete Startup Guide

## 📋 Overview

This guide shows you how to start the **Naira Vault Ledger microservices architecture** with all 7 independent services.

**Time Required:** 15-20 minutes (first time), 3 minutes (subsequent)  
**Difficulty:** Intermediate  
**Best Platform:** Linux, Cloud platforms, Kubernetes  
**Status:** ✅ Complete implementation, production-ready

---

## ⚠️ Important Platform Notes

### **Linux / Cloud** ✅
- All services work perfectly
- Full Docker support
- Recommended for production

### **macOS (M1/M2)** ⚠️
- Infrastructure works (PostgreSQL, Redis, RabbitMQ)
- Simple services work (Wallet, Transaction, Currency)
- Complex services may have Docker issues
- **Recommendation:** Run services locally (see Option 2)

### **Windows** ⚠️
- Use WSL2 + Docker for best results
- Or run services locally

---

## ✅ Prerequisites

### **Required Software:**
- Docker Desktop installed and running
- Node.js 18+ (for local development)
- Git
- curl (for testing)

### **Verify Prerequisites:**
```bash
# Check Docker
docker --version
docker-compose --version
docker ps

# Check Node.js
node --version
npm --version

# Check you're in the right directory
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/microservices-implementation
pwd
# Should show: .../naira-vault-ledger/microservices-implementation
```

---

## 🚀 Option 1: Full Docker Deployment (Linux/Production)

### **Step 1: Configure Environment**

```bash
# Create environment file (first time only)
cat > .env << 'EOF'
# SMTP Configuration (optional in development)
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# SMS Configuration (optional in development)
SMS_API_KEY=your_termii_api_key

# Exchange Rate API (optional)
EXCHANGE_RATE_API_KEY=your_api_key
EOF
```

---

### **Step 2: Build All Services**

```bash
# This builds Docker images for all services
# Takes 5-10 minutes first time
docker-compose -f docker-compose.microservices.yml build

# You'll see:
# Building api-gateway...
# Building auth-service...
# Building notification-service...
# Building user-service...
# Building wallet-service...
# Building transaction-service...
# Building currency-service...
# Building frontend...
```

---

### **Step 3: Start All Services**

```bash
# Start all 11 containers
docker-compose -f docker-compose.microservices.yml up -d

# Expected output:
# Creating network "naira-vault-network-ms"
# Creating naira-vault-postgres-ms
# Creating naira-vault-redis-ms
# Creating naira-vault-rabbitmq-ms
# Creating naira-vault-notification-service
# Creating naira-vault-auth-service
# Creating naira-vault-user-service
# Creating naira-vault-wallet-service
# Creating naira-vault-transaction-service
# Creating naira-vault-currency-service
# Creating naira-vault-api-gateway
# Creating naira-vault-frontend-ms

# Wait 60 seconds for initialization
echo "Waiting for services to start..."
sleep 60
```

---

### **Step 4: Verify Services**

```bash
# Check all containers are running
docker ps

# Should show 11 containers with Status "Up"

# Check service health
curl http://localhost:8000/health

# Check all services health
curl http://localhost:8000/health/services | python3 -m json.tool

# Expected: All services showing "status": "UP"
```

---

### **Step 5: Access Application**

```bash
# Open in browser
open http://localhost:3000

# You should see the landing page!
```

---

## 🔧 Option 2: Local Development (Recommended for Mac)

Run services locally instead of Docker to avoid platform issues.

### **Step 1: Start Infrastructure Only**

```bash
# From microservices-implementation directory
docker-compose -f docker-compose.microservices.yml up -d postgres redis rabbitmq

# This starts:
# - PostgreSQL (port 5444)
# - Redis (port 6379)
# - RabbitMQ (ports 5672, 15672)

# Wait 15 seconds
sleep 15

# Verify
docker ps
# Should show 3 containers running
```

---

### **Step 2: Install Dependencies for All Services**

```bash
# From microservices-implementation directory

# Shared libraries
cd services/shared
npm install
cd ../..

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
```

Or use a loop:
```bash
for service in shared api-gateway auth-service notification-service user-service wallet-service transaction-service currency-service; do
  echo "Installing $service..."
  cd services/$service && npm install && cd ../..
done
```

---

### **Step 3: Start Each Service** (Separate Terminals)

Open 7+ terminal windows:

**Terminal 1: Notification Service**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/microservices-implementation/services/notification-service
PORT=8006 npm run dev
```

**Terminal 2: Auth Service**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/microservices-implementation/services/auth-service
PORT=8001 npm run dev
```

**Terminal 3: User Service**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/microservices-implementation/services/user-service
PORT=8002 npm run dev
```

**Terminal 4: Wallet Service**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/microservices-implementation/services/wallet-service
PORT=8003 npm run dev
```

**Terminal 5: Transaction Service**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/microservices-implementation/services/transaction-service
PORT=8004 npm run dev
```

**Terminal 6: Currency Service**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/microservices-implementation/services/currency-service
PORT=8005 npm run dev
```

**Terminal 7: API Gateway**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/microservices-implementation/services/api-gateway
PORT=8000 npm run dev
```

**Terminal 8: Frontend**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger
npm run dev
```

---

### **Step 4: Verify All Services**

```bash
# In a new terminal, check each service:
curl http://localhost:8000/health   # API Gateway
curl http://localhost:8001/health   # Auth Service
curl http://localhost:8002/health   # User Service
curl http://localhost:8003/health   # Wallet Service
curl http://localhost:8004/health   # Transaction Service
curl http://localhost:8005/health   # Currency Service
curl http://localhost:8006/health   # Notification Service

# All should return: {"status":"OK"...}
```

---

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | User interface |
| **API Gateway** | http://localhost:8000 | Main API entry point |
| **Auth Service** | http://localhost:8001/health | Authentication |
| **User Service** | http://localhost:8002/health | User profiles |
| **Wallet Service** | http://localhost:8003/health | Wallets |
| **Transaction Service** | http://localhost:8004/health | Transactions |
| **Currency Service** | http://localhost:8005/health | Exchange rates |
| **Notification Service** | http://localhost:8006/health | Email/SMS |
| **Service Health Dashboard** | http://localhost:8000/health/services | All services status |
| **RabbitMQ Management** | http://localhost:15672 | Message queue UI |

**RabbitMQ Credentials:**
- Username: `naira_vault`
- Password: `naira_vault_password`

---

## 🧪 Testing the Microservices

### **Test 1: Service Health**

```bash
# Check all services through API Gateway
curl -s http://localhost:8000/health/services | python3 -m json.tool

# Expected output:
{
  "status": "OK",
  "services": {
    "auth": {
      "status": "UP",
      "url": "http://localhost:8001"
    },
    "user": {
      "status": "UP",
      "url": "http://localhost:8002"
    },
    ...
  }
}
```

### **Test 2: User Registration**

```bash
# Register through API Gateway
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "micro@test.com",
    "phone": "+2348087654321",
    "password": "Test@123456",
    "firstName": "Micro",
    "lastName": "Service"
  }' | python3 -m json.tool

# Check auth-service logs for OTP codes
```

### **Test 3: Service Communication**

```bash
# Test that API Gateway routes to Auth Service
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@nairavault.com",
    "password": "Test@123"
  }' | python3 -m json.tool

# This request:
# 1. Hits API Gateway (8000)
# 2. Routes to Auth Service (8001)
# 3. Auth Service queries database
# 4. Returns JWT token
```

### **Test 4: Event-Driven Communication**

1. **Open RabbitMQ UI:**
   ```bash
   open http://localhost:15672
   # Login: naira_vault / naira_vault_password
   ```

2. **Register a user** through the application

3. **Watch in RabbitMQ:**
   - Click "Queues" tab
   - See `auth-service.user.registered` queue
   - See messages being processed

---

## 📊 Monitoring

### **View All Logs:**
```bash
# Real-time logs from all services
docker-compose -f docker-compose.microservices.yml logs -f

# Specific service logs
docker-compose -f docker-compose.microservices.yml logs -f auth-service

# Last 100 lines
docker-compose -f docker-compose.microservices.yml logs --tail=100

# Follow logs for multiple services
docker-compose -f docker-compose.microservices.yml logs -f auth-service notification-service
```

### **Resource Usage:**
```bash
# Check CPU, Memory usage
docker stats

# Specific container
docker stats naira-vault-auth-service
```

### **Container Status:**
```bash
# List all containers
docker-compose -f docker-compose.microservices.yml ps

# Format for easier reading
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## 🛑 Stop Services

### **Stop All Services:**
```bash
docker-compose -f docker-compose.microservices.yml down
```

### **Stop But Keep Data:**
```bash
docker-compose -f docker-compose.microservices.yml stop
```

### **Complete Cleanup:**
```bash
# Remove containers, networks, and volumes
docker-compose -f docker-compose.microservices.yml down -v

# Remove images too
docker-compose -f docker-compose.microservices.yml down -v --rmi all
```

---

## 🔄 Restart Services

### **Restart All:**
```bash
docker-compose -f docker-compose.microservices.yml restart
```

### **Restart Specific Service:**
```bash
docker-compose -f docker-compose.microservices.yml restart auth-service
```

### **Rebuild and Restart:**
```bash
# After code changes
docker-compose -f docker-compose.microservices.yml up -d --build auth-service
```

---

## 🐛 Troubleshooting

### **Issue: Services Keep Restarting**

**Check logs:**
```bash
docker-compose -f docker-compose.microservices.yml logs auth-service

# Look for error messages
```

**Common causes:**
- Database not ready (wait longer)
- Missing environment variables
- Port conflicts
- Dependency issues

**Solutions:**
```bash
# Rebuild with no cache
docker-compose -f docker-compose.microservices.yml build --no-cache auth-service

# Restart database
docker-compose -f docker-compose.microservices.yml restart postgres

# Wait for database
sleep 30

# Restart service
docker-compose -f docker-compose.microservices.yml restart auth-service
```

---

### **Issue: Cannot Access Services**

**Check if services are running:**
```bash
docker ps | grep naira-vault
```

**Check if ports are accessible:**
```bash
curl http://localhost:8000/health
curl http://localhost:8001/health
```

**Check Docker network:**
```bash
docker network ls | grep naira-vault
```

---

### **Issue: Database Connection Failed**

```bash
# Ensure PostgreSQL is healthy
docker ps | grep postgres

# Check PostgreSQL logs
docker-compose -f docker-compose.microservices.yml logs postgres

# Restart PostgreSQL
docker-compose -f docker-compose.microservices.yml restart postgres

# Wait and restart services
sleep 20
docker-compose -f docker-compose.microservices.yml restart
```

---

### **Issue: RabbitMQ Not Working**

```bash
# Check RabbitMQ is running
docker ps | grep rabbitmq

# Check RabbitMQ logs
docker-compose -f docker-compose.microservices.yml logs rabbitmq

# Access RabbitMQ management UI
open http://localhost:15672
# Login: naira_vault / naira_vault_password
```

---

### **Issue: Out of Memory**

**Allocate more resources in Docker Desktop:**
1. Open Docker Desktop
2. Go to Settings/Preferences
3. Resources
4. Set Memory to 8GB minimum
5. Apply & Restart
6. Start services again

---

## 📊 What's Running

When fully started, you'll have:

### **Infrastructure (3 containers):**
- PostgreSQL database (port 5444)
- Redis cache (port 6379)
- RabbitMQ message queue (ports 5672, 15672)

### **Microservices (7 containers):**
- API Gateway (port 8000)
- Auth Service (port 8001)
- User Service (port 8002)
- Wallet Service (port 8003)
- Transaction Service (port 8004)
- Currency Service (port 8005)
- Notification Service (port 8006)

### **Frontend (1 container):**
- React application (port 3000)

**Total: 11 Docker containers**

---

## 🔍 Service Communication

### **How Requests Flow:**

```
Browser (3000)
    ↓
API Gateway (8000)
    ↓
    ├─→ Auth Service (8001) ─→ Notification Service (8006)
    ├─→ User Service (8002)
    ├─→ Wallet Service (8003)
    ├─→ Transaction Service (8004) ─→ Currency Service (8005)
    └─→ Currency Service (8005)
         ↓
    [PostgreSQL] [Redis] [RabbitMQ]
```

### **Event Flow:**

```
Auth Service
    ↓ (publishes event)
RabbitMQ
    ↓ (delivers to subscribers)
Notification Service (sends email)
Wallet Service (creates wallets)
```

---

## 🎯 Testing the System

### **Test Registration Flow:**

1. **Start Services** (as per steps above)

2. **Open Application:**
   ```bash
   open http://localhost:3000
   ```

3. **Navigate to Registration:**
   - Click "Get Started"
   - Or visit http://localhost:3000/register

4. **Fill Registration Form:**
   - First Name: Test
   - Last Name: Micro
   - Email: micro@test.com
   - Phone: +2348012345678
   - Password: Test@123456

5. **Submit and Check Logs:**
   ```bash
   # Watch auth service for OTP codes
   docker-compose -f docker-compose.microservices.yml logs -f auth-service
   
   # Look for:
   # 📧 OTP Email for micro@test.com: 123456
   # 📱 OTP SMS for +2348012345678: 654321
   ```

6. **Complete Verification:**
   - Enter email OTP
   - Enter phone OTP
   - Get redirected to dashboard

7. **Verify Event Processing:**
   - Check RabbitMQ UI: http://localhost:15672
   - See queues and messages
   - Check notification-service logs for email sending

---

## 🔧 Advanced Configuration

### **Scale Services:**

```bash
# Scale auth-service to 3 instances
docker-compose -f docker-compose.microservices.yml up -d --scale auth-service=3

# Scale multiple services
docker-compose -f docker-compose.microservices.yml up -d \
  --scale auth-service=3 \
  --scale transaction-service=2 \
  --scale wallet-service=2
```

### **Update Specific Service:**

```bash
# Make code changes in services/auth-service/src/

# Rebuild and restart just that service
docker-compose -f docker-compose.microservices.yml up -d --build auth-service

# Check logs
docker-compose -f docker-compose.microservices.yml logs -f auth-service
```

### **Database Access:**

```bash
# Connect to PostgreSQL
docker exec -it naira-vault-postgres-ms psql -U naira_vault -d naira_vault_db

# Run queries:
SELECT * FROM users;
SELECT * FROM otp_verifications ORDER BY created_at DESC LIMIT 5;
\dt                    # List tables
\q                     # Quit
```

---

## 📈 Performance Monitoring

### **Check Service Response Times:**

```bash
# Test API Gateway
time curl http://localhost:8000/health

# Test Auth Service directly
time curl http://localhost:8001/health

# Test through Gateway vs Direct
time curl http://localhost:8000/api/currency/rates
time curl http://localhost:8005/currency/rates
```

### **Monitor Container Resources:**

```bash
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

### **Check Database Connections:**

```bash
# Inside PostgreSQL
docker exec -it naira-vault-postgres-ms psql -U naira_vault -d naira_vault_db -c "SELECT COUNT(*) FROM pg_stat_activity;"
```

---

## 🔄 Daily Workflow

### **Morning Startup:**

```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/microservices-implementation

# Start everything
docker-compose -f docker-compose.microservices.yml up -d

# Wait for initialization
sleep 60

# Verify
curl http://localhost:8000/health/services

# Open application
open http://localhost:3000
```

### **During Development:**

```bash
# View logs of service you're working on
docker-compose -f docker-compose.microservices.yml logs -f auth-service

# Make changes to code

# Rebuild and restart
docker-compose -f docker-compose.microservices.yml up -d --build auth-service
```

### **End of Day:**

```bash
# Option 1: Stop but keep containers
docker-compose -f docker-compose.microservices.yml stop

# Option 2: Remove containers (keeps volumes/data)
docker-compose -f docker-compose.microservices.yml down

# Option 3: Complete cleanup
docker-compose -f docker-compose.microservices.yml down -v
```

---

## 📋 Service Startup Order

Docker Compose handles dependencies, but here's the order:

```
1. PostgreSQL, Redis, RabbitMQ (infrastructure)
   ↓
2. Notification Service (no dependencies on other services)
   ↓
3. Auth Service (depends on Notification)
   ↓
4. User Service (depends on Auth)
   ↓
5. Wallet, Transaction, Currency Services (parallel)
   ↓
6. API Gateway (depends on all services)
   ↓
7. Frontend (depends on API Gateway)
```

---

## 🎓 Understanding the Architecture

### **Service Responsibilities:**

**API Gateway (8000):**
- Routes requests to appropriate services
- Validates JWT tokens
- Rate limiting
- CORS handling

**Auth Service (8001):**
- User registration
- Login/Logout
- OTP generation and verification
- JWT token management

**Notification Service (8006):**
- Send OTP emails
- Send OTP SMS
- Send welcome emails
- Listen to events from other services

**User Service (8002):**
- User profile management
- KYC verification
- User settings

**Wallet Service (8003):**
- Wallet CRUD operations
- Balance management
- Holds management

**Transaction Service (8004):**
- Transaction processing
- Ledger entries
- Transaction history

**Currency Service (8005):**
- Exchange rate management
- Currency conversion
- Rate caching

---

## 📊 Expected Startup Messages

### **API Gateway:**
```
==================================================
🌐 API Gateway running on port 8000
📍 API URL: http://localhost:8000/api
🏥 Health: http://localhost:8000/health
🔍 Service Health: http://localhost:8000/health/services
🌍 Environment: development
==================================================
```

### **Auth Service:**
```
==================================================
🔐 auth-service running on port 8001
📍 URL: http://localhost:8001
🏥 Health: http://localhost:8001/health
🌍 Environment: development
==================================================
```

### **Notification Service:**
```
==================================================
📧 notification-service running on port 8006
📍 URL: http://localhost:8006
🏥 Health: http://localhost:8006/health
🌍 Environment: development
==================================================
```

---

## ⏱️ Startup Times

| Task | First Time | Subsequent |
|------|------------|------------|
| Build Docker images | 10 min | N/A (cached) |
| Start infrastructure | 30 sec | 15 sec |
| Start all services | 2 min | 30 sec |
| Services ready | 1 min | 30 sec |
| **Total** | **~14 min** | **~2 min** |

---

## 📚 Additional Resources

**In this directory:**
- [README.md](./README.md) - Microservices overview
- [SETUP_MICROSERVICES.md](./SETUP_MICROSERVICES.md) - Quick setup
- [PRACTICAL_MICROSERVICES_SETUP.md](./PRACTICAL_MICROSERVICES_SETUP.md) - Practical approach
- [FINAL_RECOMMENDATION.md](./FINAL_RECOMMENDATION.md) - When to use microservices

**In docs folder:**
- [../docs/MICROSERVICES_ARCHITECTURE.md](../docs/MICROSERVICES_ARCHITECTURE.md) - Complete architecture
- [../docs/MICROSERVICES_DOCKER_SETUP_MAC.md](../docs/MICROSERVICES_DOCKER_SETUP_MAC.md) - Mac-specific guide
- [../docs/HYBRID_DEPLOYMENT_GUIDE.md](../docs/HYBRID_DEPLOYMENT_GUIDE.md) - Deployment strategies

---

## ✨ Summary

**Startup Options:**
1. ✅ **Full Docker** (Linux) - Production deployment
2. ✅ **Local Services** (Mac) - Development & debugging
3. ✅ **Hybrid** - Infrastructure in Docker, services local

**Current Status:**
- ✅ All services implemented
- ✅ Docker configuration ready
- ✅ Production-ready for Linux
- ✅ Local development option available

**Recommendation:**
- **Mac Development:** Use monolith (easier) or run services locally
- **Linux Production:** Use full Docker setup
- **Cloud/Kubernetes:** Deploy with orchestration

---

## 🎊 You're Ready!

Choose your startup method:
- **Option 1:** Full Docker (Linux production)
- **Option 2:** Local services (Mac development)

Both give you the complete microservices experience!

---

**Created:** October 28, 2025  
**Platform:** Cross-platform (optimized for Linux)  
**Status:** Production-ready  
**Support:** See [TROUBLESHOOTING](#troubleshooting) section

🚀 **Welcome to microservices architecture!**

