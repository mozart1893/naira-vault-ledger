# 📚 Startup Guides - Quick Index

## 🎯 Choose Your Path

### **For Development on Mac** (Recommended)
→ **[docs/MONOLITH_STARTUP_GUIDE.md](./docs/MONOLITH_STARTUP_GUIDE.md)**

**Quick Command:**
```bash
docker-compose -f docker-compose.dev.yml up -d postgres redis
cd backend && npm run dev              # Terminal 1
cd .. && npm run dev                   # Terminal 2
```

---

### **For Production Deployment** (Linux/Cloud)
→ **[microservices-implementation/MICROSERVICES_STARTUP_GUIDE.md](./microservices-implementation/MICROSERVICES_STARTUP_GUIDE.md)**

**Quick Command:**
```bash
cd microservices-implementation
docker-compose -f docker-compose.microservices.yml up -d
```

---

## 📖 Complete Documentation

### **Startup Guides:**
| Guide | Purpose | Platform |
|-------|---------|----------|
| **[MONOLITH_STARTUP_GUIDE.md](./docs/MONOLITH_STARTUP_GUIDE.md)** | Monolithic backend startup | Mac, Linux, Windows |
| **[MICROSERVICES_STARTUP_GUIDE.md](./microservices-implementation/MICROSERVICES_STARTUP_GUIDE.md)** | Microservices startup | Linux (best), Mac (local) |
| **[QUICK_START.md](./docs/QUICK_START.md)** | Quick 5-minute setup | Mac |
| **[MICROSERVICES_DOCKER_SETUP_MAC.md](./docs/MICROSERVICES_DOCKER_SETUP_MAC.md)** | Docker on Mac (detailed) | macOS |

### **Architecture Guides:**
| Guide | Purpose |
|-------|---------|
| **[MICROSERVICES_ARCHITECTURE.md](./docs/MICROSERVICES_ARCHITECTURE.md)** | Complete microservices design |
| **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | Overall system architecture |
| **[HYBRID_DEPLOYMENT_GUIDE.md](./docs/HYBRID_DEPLOYMENT_GUIDE.md)** | Deployment strategies |

### **Feature Guides:**
| Guide | Purpose |
|-------|---------|
| **[USER_REGISTRATION.md](./docs/USER_REGISTRATION.md)** | Registration feature |
| **[AUTHENTICATION_GUARDS.md](./docs/AUTHENTICATION_GUARDS.md)** | Auth system |
| **[API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)** | API reference |

---

## 🚀 Quick Start Commands

### **Monolith (2 minutes):**
```bash
docker-compose -f docker-compose.dev.yml up -d postgres redis
cd backend && npm run dev &
npm run dev &
open http://localhost:3000
```

### **Microservices (15 minutes first time, 2 minutes after):**
```bash
cd microservices-implementation
docker-compose -f docker-compose.microservices.yml up -d
sleep 60
open http://localhost:3000
```

---

## 📊 Comparison

| Aspect | Monolith | Microservices |
|--------|----------|---------------|
| **Startup Time** | ~30 seconds | ~2 minutes |
| **Terminals Needed** | 2-3 | 1 (Docker) or 8+ (local) |
| **Complexity** | Low | High |
| **Best For** | Development | Production scale |
| **Mac Compatibility** | ✅ Perfect | ⚠️ Use local services |
| **Linux Compatibility** | ✅ Perfect | ✅ Perfect |

---

## 🎯 Recommendation

**Start with monolith:**  
[docs/MONOLITH_STARTUP_GUIDE.md](./docs/MONOLITH_STARTUP_GUIDE.md)

**Explore microservices when:**
- You want to learn the architecture
- Deploying to Linux production
- Need to scale beyond 10k users
- Have multiple development teams

---

## 📁 File Locations

```
naira-vault-ledger/
├── START_HERE.md                               ← Quickest start
├── STARTUP_GUIDES_INDEX.md                     ← This file
├── docs/
│   └── MONOLITH_STARTUP_GUIDE.md              ← Monolith startup
└── microservices-implementation/
    └── MICROSERVICES_STARTUP_GUIDE.md          ← Microservices startup
```

---

**Created:** October 28, 2025  
**Purpose:** Quick navigation to startup guides  
**Status:** Complete

🚀 **Choose your guide and get started!**

