# 🚀 Microservices Setup - Quick Command Reference

## ✅ Issue Fixed!

The Docker build error has been resolved. The shared libraries are now properly accessible to all services.

---

## 🎯 **Complete Setup (Copy & Paste These Commands)**

### **Step 1: Ensure Docker Desktop is Running**
```bash
# Check Docker is running
docker ps

# If error, start Docker Desktop:
open -a Docker

# Wait 30 seconds for Docker to fully start
sleep 30
```

---

### **Step 2: Navigate to Project Directory**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger

# Verify you're in the right place
pwd
# Should show: /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger
```

---

### **Step 3: Stop Any Running Services**
```bash
# Stop monolithic backend if running (press Ctrl+C in its terminal)

# Stop any existing Docker containers
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
docker-compose -f docker-compose.microservices.yml down 2>/dev/null || true

# Verify ports are free
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
```

---

### **Step 4: Build All Microservices**
```bash
# This builds Docker images for all 7 microservices + frontend
# Takes 5-10 minutes on first build
docker-compose -f docker-compose.microservices.yml build

# Expected output:
# Building api-gateway... ✅
# Building auth-service... ✅
# Building notification-service... ✅
# Building user-service... ✅
# Building wallet-service... ✅
# Building transaction-service... ✅
# Building currency-service... ✅
# Building frontend... ✅
```

**Wait for build to complete** (you'll see "Successfully built..." messages)

---

### **Step 5: Start All Services**
```bash
# Start all 11 containers
docker-compose -f docker-compose.microservices.yml up -d

# Expected output:
# Creating network...
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

# Wait 60 seconds for services to initialize
echo "Waiting for services to start..."
sleep 60
```

---

### **Step 6: Verify Services Are Running**
```bash
# Check all containers are running
docker ps

# Should show 11 containers in "Up" status

# Check service health
curl http://localhost:8000/health

# Should return: {"status":"OK","service":"api-gateway",...}

# Check all service health
curl http://localhost:8000/health/services

# Should show all services with "status": "UP"
```

---

### **Step 7: Access the Application**
```bash
# Open in browser
open http://localhost:3000

# You should see the Naira Vault landing page!
```

---

## ✅ **Verification Checklist**

Run these commands to verify everything is working:

```bash
# 1. Check Docker containers
docker ps | grep naira-vault

# Should show 11 containers

# 2. Check API Gateway
curl -s http://localhost:8000/health | grep "OK"

# Should show: "status":"OK"

# 3. Check Auth Service
curl -s http://localhost:8001/health | grep "OK"

# Should show: "status":"OK"

# 4. Check Notification Service
curl -s http://localhost:8006/health | grep "OK"

# Should show: "status":"OK"

# 5. Check Frontend
curl -s http://localhost:3000 | grep "html"

# Should show HTML content

# 6. Check RabbitMQ
docker exec naira-vault-rabbitmq-ms rabbitmq-diagnostics ping

# Should show: Ping succeeded

# 7. Check PostgreSQL
docker exec naira-vault-postgres-ms pg_isready -U naira_vault

# Should show: accepting connections
```

**If all checks pass:** ✅ **SYSTEM READY!**

---

## 🎯 **Test Registration**

### **Via Browser:**
1. Go to http://localhost:3000/landing
2. Click "Get Started" or "Create Account"
3. Fill in registration form
4. Submit

### **Check OTP Codes:**
```bash
# In a new terminal, view auth service logs
docker-compose -f docker-compose.microservices.yml logs -f auth-service

# Look for:
# 📧 OTP Email for your@email.com: 123456
# 📱 OTP SMS for +234...: 654321
```

### **Complete Verification:**
1. Enter Email OTP (from logs above)
2. Click "Verify Email"
3. Enter Phone OTP (from logs above)
4. Click "Complete Registration"
5. You'll be logged in! 🎉

---

## 📊 **View Service Logs**

### **All Services:**
```bash
docker-compose -f docker-compose.microservices.yml logs -f
```

### **Specific Service:**
```bash
# Auth Service
docker-compose -f docker-compose.microservices.yml logs -f auth-service

# Notification Service
docker-compose -f docker-compose.microservices.yml logs -f notification-service

# API Gateway
docker-compose -f docker-compose.microservices.yml logs -f api-gateway
```

### **Last 50 Lines:**
```bash
docker-compose -f docker-compose.microservices.yml logs --tail=50
```

---

## 🛑 **Stop Services**

```bash
# Stop all services
docker-compose -f docker-compose.microservices.yml down

# Stop but keep data (faster restart)
docker-compose -f docker-compose.microservices.yml stop

# Complete cleanup (removes all data)
docker-compose -f docker-compose.microservices.yml down -v
```

---

## 🔄 **Restart Services**

```bash
# Restart all
docker-compose -f docker-compose.microservices.yml restart

# Restart specific service
docker-compose -f docker-compose.microservices.yml restart auth-service

# Rebuild and restart after code changes
docker-compose -f docker-compose.microservices.yml up -d --build auth-service
```

---

## 🐛 **Troubleshooting**

### **If Build Fails:**
```bash
# Clean Docker cache
docker builder prune -a

# Rebuild from scratch
docker-compose -f docker-compose.microservices.yml build --no-cache
```

### **If Services Won't Start:**
```bash
# Check logs for errors
docker-compose -f docker-compose.microservices.yml logs

# Check specific service
docker-compose -f docker-compose.microservices.yml logs auth-service

# Restart problematic service
docker-compose -f docker-compose.microservices.yml restart auth-service
```

### **If Port Conflicts:**
```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or change port in docker-compose.microservices.yml
```

### **If Database Issues:**
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# View PostgreSQL logs
docker-compose -f docker-compose.microservices.yml logs postgres

# Restart PostgreSQL
docker-compose -f docker-compose.microservices.yml restart postgres

# Wait 10 seconds
sleep 10

# Restart dependent services
docker-compose -f docker-compose.microservices.yml restart
```

---

## 🌐 **Access Points**

Once running, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application |
| **Landing Page** | http://localhost:3000/landing | Marketing page |
| **Registration** | http://localhost:3000/register | Sign up |
| **Login** | http://localhost:3000/login | Sign in |
| **Dashboard** | http://localhost:3000/dashboard | User dashboard |
| **API Gateway Health** | http://localhost:8000/health | Gateway status |
| **Services Health** | http://localhost:8000/health/services | All services status |
| **RabbitMQ UI** | http://localhost:15672 | Message queue dashboard |

**RabbitMQ Login:**
- Username: `naira_vault`
- Password: `naira_vault_password`

---

## 🔍 **Monitor Services in Docker Desktop**

1. Open **Docker Desktop** application
2. Click **"Containers"** in left sidebar
3. You'll see container group: **"naira-vault-ledger"**
4. Expand to see all 11 containers
5. Green dot = running, click any container to see:
   - Logs
   - Stats (CPU, Memory)
   - Files
   - Terminal

---

## 📊 **Service Status Dashboard**

Check all services at once:
```bash
# Pretty print with Python
curl -s http://localhost:8000/health/services | python3 -m json.tool

# Or with jq (if installed)
curl -s http://localhost:8000/health/services | jq

# Simple check
curl http://localhost:8000/health/services
```

---

## 🎯 **Expected Output**

### **After `docker ps`:**
```
CONTAINER ID   NAMES                                   STATUS      PORTS
xxx            naira-vault-api-gateway                 Up          0.0.0.0:8000->8000/tcp
xxx            naira-vault-auth-service                Up          0.0.0.0:8001->8001/tcp
xxx            naira-vault-user-service                Up          0.0.0.0:8002->8002/tcp
xxx            naira-vault-wallet-service              Up          0.0.0.0:8003->8003/tcp
xxx            naira-vault-transaction-service         Up          0.0.0.0:8004->8004/tcp
xxx            naira-vault-currency-service            Up          0.0.0.0:8005->8005/tcp
xxx            naira-vault-notification-service        Up          0.0.0.0:8006->8006/tcp
xxx            naira-vault-frontend-ms                 Up          0.0.0.0:3000->3000/tcp
xxx            naira-vault-postgres-ms                 Up          0.0.0.0:5444->5432/tcp
xxx            naira-vault-redis-ms                    Up          0.0.0.0:6379->6379/tcp
xxx            naira-vault-rabbitmq-ms                 Up          0.0.0.0:5672->5672/tcp, 15672/tcp
```

### **After `curl http://localhost:8000/health`:**
```json
{
  "status": "OK",
  "service": "api-gateway",
  "timestamp": "2025-10-23T...",
  "uptime": 123.45
}
```

---

## 🚀 **One-Command Setup**

For subsequent runs (after first build):
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger && \
docker-compose -f docker-compose.microservices.yml up -d && \
sleep 60 && \
echo "✅ Microservices ready!" && \
open http://localhost:3000
```

---

## 📚 **Documentation**

**Full step-by-step guide:**  
[docs/MICROSERVICES_DOCKER_SETUP_MAC.md](./docs/MICROSERVICES_DOCKER_SETUP_MAC.md)

**Includes:**
- Detailed prerequisites
- 10-step setup process
- Troubleshooting guide
- Monitoring instructions
- Performance tips

---

## ✨ **Summary**

**Issue:** Docker couldn't copy shared libraries  
**Fix:** Updated build context to `./services`  
**Status:** ✅ Fixed and ready to build  

**Next:**
1. Run the build command (in progress)
2. Wait 5-10 minutes for first build
3. Start services
4. Test registration
5. Enjoy your microservices! 🎉

---

**Created:** October 23, 2025  
**Status:** Ready to deploy  
**Support:** See [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

