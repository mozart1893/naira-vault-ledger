# Microservices Implementation Guide - Naira Vault Ledger

## Executive Summary

This document provides a comprehensive guide for converting the Naira Vault Ledger from a monolithic architecture to microservices.

## Current Status

### ✅ Completed
- [x] Microservices architecture documentation
- [x] Shared libraries created (logger, database, redis, rabbitmq, errors, middleware)
- [x] Directory structure for all services
- [x] API Gateway foundation
- [x] Auth Service extraction started
- [x] Package.json files for services

### 🚧 In Progress
- [ ] Complete Auth Service migration
- [ ] Create Notification Service
- [ ] Create User Service
- [ ] Create Wallet Service
- [ ] Create Transaction Service
- [ ] Create Currency Service
- [ ] Docker Compose for microservices
- [ ] Inter-service communication
- [ ] Testing framework

## Project Structure

```
naira-vault-ledger/
├── services/
│   ├── shared/                    ✅ Created
│   │   ├── logger/               ✅ Winston logger
│   │   ├── database/             ✅ PostgreSQL utilities
│   │   ├── redis/                ✅ Redis client
│   │   ├── rabbitmq/             ✅ Message queue
│   │   ├── errors/               ✅ Custom errors
│   │   └── middleware/           ✅ Shared middleware
│   │
│   ├── api-gateway/               ✅ Created
│   │   ├── src/
│   │   │   └── index.js          ✅ Gateway routing
│   │   └── package.json          ✅ Dependencies
│   │
│   ├── auth-service/              🚧 In Progress
│   │   ├── src/
│   │   │   ├── index.js          ✅ Service entry point
│   │   │   ├── controllers/      ✅ Auth logic (needs updates)
│   │   │   ├── routes/           ✅ Auth routes
│   │   │   ├── validators/       ✅ Validation schemas
│   │   │   └── utils/            ✅ OTP utilities
│   │   └── package.json          ✅ Dependencies
│   │
│   ├── notification-service/      ⏳ Pending
│   ├── user-service/              ⏳ Pending
│   ├── wallet-service/            ⏳ Pending
│   ├── transaction-service/       ⏳ Pending
│   └── currency-service/          ⏳ Pending
│
├── backend/                       📦 Legacy (being migrated)
├── src/                          ✅ Frontend (no changes needed)
└── docs/                         ✅ Documentation
```

## Microservices Breakdown

### Service Responsibilities

| Service | Port | Database Tables | Key Functions |
|---------|------|----------------|---------------|
| **API Gateway** | 8000 | None | Route requests, validate tokens |
| **Auth Service** | 8001 | users (auth), otp_verifications | Registration, login, OTP |
| **Notification Service** | 8006 | notification_logs | Email, SMS, push |
| **User Service** | 8002 | users (profile), kyc_documents | Profile, KYC |
| **Wallet Service** | 8003 | wallets, holds | Wallet CRUD, balances |
| **Transaction Service** | 8004 | transactions, ledger_entries | Transactions, ledger |
| **Currency Service** | 8005 | exchange_rates | Rates, conversions |

## Implementation Phases

### Phase 1: Foundation (Week 1) ✅
- [x] Create architecture documentation
- [x] Set up shared libraries
- [x] Create service directories
- [x] Define service boundaries

### Phase 2: Core Services (Week 2) 🚧
- [ ] Complete Auth Service
- [ ] Complete Notification Service  
- [ ] Create API Gateway routing
- [ ] Test auth flow end-to-end
- [ ] Create Docker Compose for services

### Phase 3: Business Services (Week 3)
- [ ] Complete User Service
- [ ] Complete Wallet Service
- [ ] Complete Transaction Service
- [ ] Complete Currency Service
- [ ] Implement event-driven communication

### Phase 4: Testing & Optimization (Week 4)
- [ ] Integration testing
- [ ] Performance testing
- [ ] Load testing
- [ ] Documentation updates
- [ ] Deployment scripts

## Service Communication

### Synchronous (HTTP)
```javascript
// API Gateway → Auth Service
GET /api/auth/login → http://auth-service:8001/auth/login

// Auth Service → Notification Service
POST http://notification-service:8006/notifications/otp-email
```

### Asynchronous (Events)
```javascript
// Auth Service publishes
publishEvent('user.registered', { userId, email });

// Notification Service listens
subscribeToEvent('user.registered', async (data) => {
  await sendWelcomeEmail(data.email);
});
```

## Database Strategy

### Current Approach: Shared Database with Logical Separation
```sql
-- Auth Service tables
users (id, email, password_hash, email_verified, phone_verified)
otp_verifications

-- User Service tables
user_profiles (extends users)
kyc_documents
user_settings

-- Wallet Service tables
wallets
holds
ledger_entries

-- Transaction Service tables
transactions
currency_conversions

-- Currency Service tables
exchange_rates
```

### Future Approach: Database Per Service
Each service will have its own PostgreSQL database instance.

## Environment Configuration

### API Gateway (.env)
```env
PORT=8000
NODE_ENV=development

# Service URLs
AUTH_SERVICE_URL=http://localhost:8001
USER_SERVICE_URL=http://localhost:8002
WALLET_SERVICE_URL=http://localhost:8003
TRANSACTION_SERVICE_URL=http://localhost:8004
CURRENCY_SERVICE_URL=http://localhost:8005
NOTIFICATION_SERVICE_URL=http://localhost:8006

# Security
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:3000
```

### Auth Service (.env)
```env
PORT=8001
NODE_ENV=development
SERVICE_NAME=auth-service

# Database
DATABASE_URL=postgresql://naira_vault:password@localhost:5444/naira_vault_db

# Redis
REDIS_URL=redis://localhost:6379

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# Service Communication
NOTIFICATION_SERVICE_URL=http://localhost:8006
SERVICE_SECRET=dev-secret
```

### Notification Service (.env)
```env
PORT=8006
NODE_ENV=development
SERVICE_NAME=notification-service

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password

# SMS
SMS_API_URL=https://api.termii.com/v1/sms/send
SMS_API_KEY=your_sms_key

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# Database (for logging)
DATABASE_URL=postgresql://naira_vault:password@localhost:5444/naira_vault_db
```

## Development Workflow

### Start All Services

```bash
# Option 1: Docker Compose (Recommended)
docker-compose -f docker-compose.microservices.yml up -d

# Option 2: Manual (for development)
# Terminal 1: API Gateway
cd services/api-gateway && npm install && npm run dev

# Terminal 2: Auth Service
cd services/auth-service && npm install && npm run dev

# Terminal 3: Notification Service
cd services/notification-service && npm install && npm run dev

# ... repeat for other services
```

### Start Individual Service

```bash
cd services/auth-service
npm install
npm run dev
```

## Migration Steps

### For Each Service:

1. **Create Service Directory**
   ```bash
   mkdir -p services/[service-name]/src/{controllers,routes,validators,utils}
   ```

2. **Create package.json**
   - Define dependencies
   - Add start/dev scripts

3. **Create Service Entry Point** (`src/index.js`)
   - Initialize Express
   - Connect to database/Redis/RabbitMQ
   - Register routes
   - Start server

4. **Migrate Business Logic**
   - Copy relevant controllers from monolith
   - Update database references
   - Update service calls
   - Add event publishing

5. **Create Routes**
   - Define service-specific endpoints
   - Apply middleware

6. **Add Health Check**
   - `/health` endpoint
   - Database connection status
   - Service dependencies status

7. **Update Docker Compose**
   - Add service definition
   - Configure environment
   - Set up networking

## API Gateway Routes

### Route Configuration
```javascript
/api/auth/*          → Auth Service (8001)
/api/users/*         → User Service (8002)
/api/wallets/*       → Wallet Service (8003)
/api/transactions/*  → Transaction Service (8004)
/api/currency/*      → Currency Service (8005)
```

### Request Flow
```
Client Request
    ↓
API Gateway (8000)
    ├─ Validate JWT (if required)
    ├─ Rate limiting
    ├─ Add correlation ID
    ├─ Route to service
    ↓
Target Service (800X)
    ├─ Process request
    ├─ Query database
    ├─ Publish events
    ├─ Return response
    ↓
API Gateway
    ├─ Log response
    ├─ Return to client
```

## Testing Strategy

### Unit Tests
```bash
# Per service
cd services/auth-service
npm test
```

### Integration Tests
```bash
# Test service interactions
npm run test:integration
```

### End-to-End Tests
```bash
# Through API Gateway
npm run test:e2e
```

## Deployment

### Docker Compose
```bash
# Build all services
docker-compose -f docker-compose.microservices.yml build

# Start all services
docker-compose -f docker-compose.microservices.yml up -d

# View logs
docker-compose -f docker-compose.microservices.yml logs -f

# Stop all services
docker-compose -f docker-compose.microservices.yml down
```

### Individual Service
```bash
# Build
docker build -t naira-vault-auth-service ./services/auth-service

# Run
docker run -p 8001:8001 --env-file ./services/auth-service/.env naira-vault-auth-service
```

## Monitoring & Debugging

### Service Logs
```bash
# API Gateway logs
docker-compose logs -f api-gateway

# Auth Service logs
docker-compose logs -f auth-service

# All service logs
docker-compose logs -f
```

### Health Checks
```bash
# Check all services
curl http://localhost:8000/health/services

# Check specific service
curl http://localhost:8001/health
```

### Database Queries
```bash
# Connect to PostgreSQL
docker exec -it naira-vault-postgres psql -U naira_vault -d naira_vault_db

# View users
SELECT id, email, email_verified, phone_verified FROM users;
```

## Advantages of Microservices Architecture

### Scalability
- ✅ Scale services independently
- ✅ Add instances of high-traffic services
- ✅ Optimize resources per service

### Development
- ✅ Teams can work on services independently
- ✅ Deploy services separately
- ✅ Technology flexibility per service
- ✅ Faster build and deploy times

### Reliability
- ✅ Fault isolation
- ✅ Service failure doesn't crash system
- ✅ Graceful degradation
- ✅ Independent monitoring

### Maintenance
- ✅ Smaller, focused codebases
- ✅ Easier to understand and modify
- ✅ Better separation of concerns
- ✅ Clearer service boundaries

## Migration Checklist

### Infrastructure
- [x] Create service directories
- [x] Create shared libraries
- [x] Define service boundaries
- [ ] Set up RabbitMQ
- [ ] Create Docker Compose file
- [ ] Set up service discovery

### API Gateway
- [x] Create gateway service
- [x] Configure routing
- [ ] Add JWT validation middleware
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Test routing

### Auth Service
- [x] Extract auth controllers
- [x] Extract auth routes
- [x] Extract validators
- [x] Extract OTP utilities
- [ ] Update database references
- [ ] Update notification calls
- [ ] Add event publishing
- [ ] Test registration flow
- [ ] Test login flow

### Notification Service
- [ ] Create service structure
- [ ] Migrate email service
- [ ] Migrate SMS service
- [ ] Create event listeners
- [ ] Add notification logging
- [ ] Test OTP delivery
- [ ] Test welcome emails

### User Service
- [ ] Create service structure
- [ ] Create profile endpoints
- [ ] Create KYC endpoints
- [ ] Add event listeners
- [ ] Test profile CRUD

### Wallet Service
- [ ] Create service structure
- [ ] Create wallet endpoints
- [ ] Implement balance logic
- [ ] Add holds management
- [ ] Test wallet operations

### Transaction Service
- [ ] Create service structure
- [ ] Create transaction endpoints
- [ ] Implement ledger logic
- [ ] Add currency conversion
- [ ] Test transactions

### Currency Service
- [ ] Create service structure
- [ ] Create rate endpoints
- [ ] Implement rate fetching
- [ ] Add caching
- [ ] Test conversions

## Quick Start (Current State)

### Prerequisites
```bash
# Ensure Docker is running
docker ps

# Ensure Node.js 18+ is installed
node --version
```

### Development Setup

Currently, the monolithic backend is working. To test the microservices:

```bash
# 1. Install shared dependencies
cd services/shared && npm install

# 2. Install API Gateway dependencies
cd ../api-gateway && npm install

# 3. Install Auth Service dependencies
cd ../auth-service && npm install

# 4. Start PostgreSQL and Redis (already running)
# (Your current Docker setup)

# 5. Start services individually (for testing)
# Terminal 1: Auth Service
cd services/auth-service && npm run dev

# Terminal 2: API Gateway
cd services/api-gateway && npm run dev
```

## Migration Timeline

### Week 1 (Current)
- ✅ Architecture design
- ✅ Shared libraries
- ✅ Service structure
- 🚧 Auth Service migration
- ⏳ Notification Service creation

### Week 2
- Complete all services
- Docker Compose setup
- Basic testing

### Week 3
- Event-driven communication
- Advanced features
- Performance optimization

### Week 4
- Full integration testing
- Documentation
- Production readiness

## Key Decisions

### 1. Database Strategy
**Decision:** Start with shared database, migrate to database-per-service later

**Rationale:**
- Faster migration
- Easier data consistency
- Can be refactored incrementally

### 2. Communication
**Decision:** REST for synchronous, RabbitMQ for async

**Rationale:**
- Simple to implement
- Well-understood patterns
- Good tooling support

### 3. Service Discovery
**Decision:** Static configuration (Docker DNS)

**Rationale:**
- Simple for development
- Docker Compose handles DNS
- Can upgrade to Consul later

### 4. API Gateway
**Decision:** Custom Express gateway with http-proxy-middleware

**Rationale:**
- Full control
- Easy to customize
- Lightweight
- Good for our scale

## Benefits for Your Project

### Immediate Benefits
1. **Better Code Organization** - Clearer separation of concerns
2. **Independent Deployment** - Deploy services separately
3. **Scalability** - Scale bottleneck services
4. **Team Scalability** - Multiple teams can work in parallel

### Long-term Benefits
1. **Technology Flexibility** - Use different tech per service if needed
2. **Fault Isolation** - Service failures contained
3. **Performance Optimization** - Optimize services individually
4. **Easier Maintenance** - Smaller, focused codebases

## Current Implementation Status

### ✅ What's Working
- Monolithic backend on port 8000
- Frontend on port 3000
- Registration with OTP
- Login with JWT
- Protected routes
- Landing page

### 🚧 What's Being Migrated
- Breaking monolith into services
- Setting up API Gateway
- Creating service-to-service communication

### ⏳ What's Next
1. Complete Auth Service extraction
2. Create Notification Service
3. Update Docker Compose
4. Test complete flow
5. Migrate remaining services

## Recommendations

### For Production Deployment

1. **Use Service Mesh** - Istio or Linkerd
2. **Centralized Logging** - ELK Stack or CloudWatch
3. **Distributed Tracing** - Jaeger or Zipkin
4. **API Gateway** - Kong or AWS API Gateway
5. **Container Orchestration** - Kubernetes
6. **CI/CD** - GitHub Actions or GitLab CI
7. **Monitoring** - Prometheus + Grafana
8. **Secrets Management** - HashiCorp Vault or AWS Secrets Manager

### For Development

1. **Keep it Simple** - Start with basic setup
2. **Iterate Quickly** - One service at a time
3. **Test Thoroughly** - Each service independently
4. **Document Well** - Keep docs updated
5. **Use Docker Compose** - Easy orchestration

## Next Steps

1. **Complete Auth Service Migration**
   - Update all database calls
   - Replace direct email/SMS with notification service calls
   - Add event publishing
   - Test thoroughly

2. **Create Notification Service**
   - Copy email/SMS services
   - Create REST endpoints
   - Add event listeners
   - Test OTP delivery

3. **Update API Gateway**
   - Complete routing configuration
   - Add health checks for services
   - Implement circuit breaker
   - Add request tracing

4. **Create Docker Compose**
   - Define all services
   - Configure networking
   - Set up environment variables
   - Add health checks

5. **Testing**
   - Test each service independently
   - Test through API Gateway
   - Test event-driven flows
   - End-to-end testing

## Support & Documentation

### Resources
- `/docs/MICROSERVICES_ARCHITECTURE.md` - Detailed architecture
- `/services/README.md` - Services overview
- Individual service READMEs - Service-specific docs

### Getting Help
1. Check service logs
2. Check health endpoints
3. Review this guide
4. Check individual service documentation

---

**Status:** 🚧 In Progress (40% Complete)  
**Target Completion:** 3-4 weeks  
**Current Focus:** Auth Service & Notification Service

---

## Summary

The microservices architecture provides a scalable, maintainable foundation for Naira Vault Ledger. The migration is progressing well with shared libraries complete and core services in development.

**Key Achievement:** You now have a solid foundation with shared utilities, clear service boundaries, and a working migration path!

The system can continue running on the monolithic backend while we complete the microservices migration in parallel. This allows for zero-downtime migration and thorough testing before cutover.


