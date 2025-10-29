# 🚀 Microservices Setup - macOS Quick Guide

## ⚡ Super Quick Setup (One Command)

```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger
./start-microservices.sh
```

**That's it!** The script handles everything automatically.

---

## 🎯 Manual Setup (If you prefer)

### **1. Ensure Docker Desktop is Running**
```bash
open -a Docker
sleep 30  # Wait for Docker to start
```

### **2. Navigate to Project**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger
```

### **3. Build & Start**
```bash
# Build (5-10 minutes first time)
docker-compose -f docker-compose.microservices.yml build

# Start
docker-compose -f docker-compose.microservices.yml up -d

# Wait for initialization
sleep 60
```

### **4. Verify**
```bash
# Check all services
curl http://localhost:8000/health/services

# Open application
open http://localhost:3000
```

---

## ✅ **What Gets Started**

- PostgreSQL (database)
- Redis (cache)
- RabbitMQ (message queue)
- 7 Microservices (ports 8001-8006)
- API Gateway (port 8000)
- Frontend (port 3000)

**Total: 11 Docker containers**

---

## 🌐 **Access Points**

| Service | URL |
|---------|-----|
| **Application** | http://localhost:3000 |
| **API** | http://localhost:8000 |
| **Service Health** | http://localhost:8000/health/services |
| **RabbitMQ** | http://localhost:15672 |

---

## 📊 **Common Commands**

```bash
# View logs
docker-compose -f docker-compose.microservices.yml logs -f

# Stop all
docker-compose -f docker-compose.microservices.yml down

# Restart all
docker-compose -f docker-compose.microservices.yml restart

# Check status
docker ps
```

---

## 📚 **Complete Documentation**

- **Detailed Guide:** [docs/MICROSERVICES_DOCKER_SETUP_MAC.md](./docs/MICROSERVICES_DOCKER_SETUP_MAC.md)
- **Troubleshooting:** [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- **Architecture:** [docs/MICROSERVICES_ARCHITECTURE.md](./docs/MICROSERVICES_ARCHITECTURE.md)

---

## 🎉 **That's It!**

Run the script and your microservices will be ready in ~15 minutes!

```bash
./start-microservices.sh
```

🚀 **Happy microservicing!**

