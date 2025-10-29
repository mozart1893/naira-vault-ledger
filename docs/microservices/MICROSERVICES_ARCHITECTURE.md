# Naira Vault Ledger - Microservices Architecture

## Overview

This document describes the microservices architecture for the Naira Vault Ledger System. The system is decomposed into independent, scalable services that communicate via REST APIs and message queues.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                    http://localhost:3000                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (8000)                          │
│  - Request routing                                               │
│  - Authentication validation                                     │
│  - Rate limiting                                                 │
│  - Load balancing                                                │
└──┬────────┬──────────┬──────────┬──────────┬──────────┬─────────┘
   │        │          │          │          │          │
   ▼        ▼          ▼          ▼          ▼          ▼
┌─────┐ ┌──────┐ ┌────────┐ ┌────────┐ ┌──────┐ ┌──────────────┐
│Auth │ │User  │ │Wallet  │ │Trans-  │ │Curr- │ │Notification  │
│Svc  │ │Svc   │ │Svc     │ │action  │ │ency  │ │Svc           │
│8001 │ │8002  │ │8003    │ │Svc     │ │Svc   │ │8006          │
│     │ │      │ │        │ │8004    │ │8005  │ │              │
└──┬──┘ └──┬───┘ └───┬────┘ └───┬────┘ └──┬───┘ └──────┬───────┘
   │       │         │          │         │            │
   ▼       ▼         ▼          ▼         ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Shared Infrastructure                         │
│  ┌──────────┐  ┌───────┐  ┌────────┐  ┌────────────────────┐   │
│  │PostgreSQL│  │ Redis │  │RabbitMQ│  │ Shared Libraries   │   │
│  │  5432    │  │ 6379  │  │  5672  │  │ - Logger           │   │
│  └──────────┘  └───────┘  └────────┘  │ - Error Handler    │   │
│                                        │ - DB Utils         │   │
│                                        └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Microservices Breakdown

### 1. API Gateway (Port 8000)
**Purpose:** Single entry point for all client requests

**Responsibilities:**
- Route requests to appropriate services
- JWT token validation
- Rate limiting
- Request/response logging
- CORS handling
- Load balancing

**Technology:**
- Express.js
- express-gateway / custom routing
- JWT middleware

**Endpoints:**
```
All endpoints prefixed with /api/*
Routes to internal services based on path
```

### 2. Auth Service (Port 8001)
**Purpose:** Handle all authentication and authorization

**Responsibilities:**
- User registration
- Email/Phone OTP verification
- Login/Logout
- JWT token generation
- Refresh tokens
- Password reset

**Database Tables:**
- users (auth fields only)
- otp_verifications
- refresh_tokens (new)
- password_reset_tokens (new)

**Internal Endpoints:**
```
POST   /auth/register
POST   /auth/verify-otp
POST   /auth/resend-otp
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/validate-token
POST   /auth/forgot-password
POST   /auth/reset-password
```

**Events Published:**
- `user.registered`
- `user.verified`
- `user.logged_in`
- `user.logged_out`

### 3. User Service (Port 8002)
**Purpose:** User profile and KYC management

**Responsibilities:**
- User profile CRUD
- KYC document management
- User verification status
- Account settings

**Database Tables:**
- users (profile fields)
- kyc_documents
- user_settings

**Internal Endpoints:**
```
GET    /users/profile
PUT    /users/profile
POST   /users/kyc
GET    /users/kyc/status
PUT    /users/settings
```

**Events Consumed:**
- `user.registered` - Create user profile
- `user.verified` - Update verification status

**Events Published:**
- `user.profile_updated`
- `user.kyc_submitted`
- `user.kyc_verified`

### 4. Wallet Service (Port 8003)
**Purpose:** Wallet and balance management

**Responsibilities:**
- Create/manage wallets
- Balance tracking (ledger & available)
- Holds management
- Wallet operations

**Database Tables:**
- wallets
- holds
- ledger_entries

**Internal Endpoints:**
```
GET    /wallets
POST   /wallets
GET    /wallets/:id
PUT    /wallets/:id
GET    /wallets/:id/balance
POST   /wallets/:id/hold
DELETE /wallets/:id/hold/:holdId
```

**Events Consumed:**
- `user.registered` - Create default wallets
- `transaction.completed` - Update balances

**Events Published:**
- `wallet.created`
- `wallet.updated`
- `wallet.balance_updated`
- `wallet.hold_placed`
- `wallet.hold_released`

### 5. Transaction Service (Port 8004)
**Purpose:** Handle all financial transactions

**Responsibilities:**
- Transaction processing
- Deposits, withdrawals, transfers
- Currency conversions
- Transaction validation
- Ledger entries

**Database Tables:**
- transactions
- ledger_entries
- currency_conversions

**Internal Endpoints:**
```
GET    /transactions
POST   /transactions/deposit
POST   /transactions/withdrawal
POST   /transactions/transfer
POST   /transactions/conversion
GET    /transactions/:id
PUT    /transactions/:id/status
POST   /transactions/:id/reverse
```

**Events Consumed:**
- `wallet.balance_updated` - Process transaction

**Events Published:**
- `transaction.created`
- `transaction.pending`
- `transaction.completed`
- `transaction.failed`
- `transaction.reversed`

### 6. Currency Service (Port 8005)
**Purpose:** Exchange rate management

**Responsibilities:**
- Fetch exchange rates from external APIs
- Store historical rates
- Currency conversion calculations
- Rate caching

**Database Tables:**
- exchange_rates
- currency_conversions

**Internal Endpoints:**
```
GET    /currency/rates
GET    /currency/rates/:from/:to
POST   /currency/convert
GET    /currency/historical
PUT    /currency/rates/refresh
```

**Events Published:**
- `exchange_rate.updated`

### 7. Notification Service (Port 8006)
**Purpose:** Handle all notifications

**Responsibilities:**
- Email notifications
- SMS notifications
- Push notifications
- Notification templates
- Delivery tracking

**Database Tables:**
- notification_logs
- notification_templates

**Internal Endpoints:**
```
POST   /notifications/email
POST   /notifications/sms
POST   /notifications/push
GET    /notifications/history
POST   /notifications/template
```

**Events Consumed:**
- `user.registered` - Send welcome email
- `user.verified` - Send verification confirmation
- `transaction.completed` - Send transaction alert
- `otp.generated` - Send OTP codes

---

## Service Communication

### 1. Synchronous (REST APIs)
- API Gateway → Services (HTTP)
- Service → Service (HTTP) for immediate responses

### 2. Asynchronous (Message Queue)
- Event-driven communication
- RabbitMQ / Redis Pub/Sub
- Decoupled services

### 3. Shared Database (Transitional)
- Initially, services share PostgreSQL
- Use schemas to separate data
- Future: Database per service

---

## Database Architecture

### Option 1: Shared Database with Schemas
```
PostgreSQL
├── auth_schema
│   ├── users (auth fields)
│   ├── otp_verifications
│   └── refresh_tokens
├── user_schema
│   ├── user_profiles
│   ├── kyc_documents
│   └── user_settings
├── wallet_schema
│   ├── wallets
│   ├── holds
│   └── ledger_entries
├── transaction_schema
│   ├── transactions
│   └── currency_conversions
└── currency_schema
    └── exchange_rates
```

### Option 2: Database Per Service (Future)
```
auth-db        - PostgreSQL for Auth Service
user-db        - PostgreSQL for User Service
wallet-db      - PostgreSQL for Wallet Service
transaction-db - PostgreSQL for Transaction Service
currency-db    - PostgreSQL for Currency Service
```

---

## Deployment Architecture

### Development Environment
```yaml
docker-compose.dev.yml:
  - api-gateway (8000)
  - auth-service (8001)
  - user-service (8002)
  - wallet-service (8003)
  - transaction-service (8004)
  - currency-service (8005)
  - notification-service (8006)
  - postgres (5432)
  - redis (6379)
  - rabbitmq (5672)
  - frontend (3000)
```

### Production Environment
- Each service in separate container
- Auto-scaling per service
- Load balancer for API Gateway
- Database replication
- Redis cluster
- RabbitMQ cluster

---

## Shared Libraries

### Common Modules
```
shared/
├── logger/          - Winston logger configuration
├── database/        - Database connection utilities
├── redis/           - Redis client
├── rabbitmq/        - Message queue client
├── errors/          - Custom error classes
├── validators/      - Common validation schemas
└── middleware/      - Shared middleware
```

---

## Service Discovery

### Option 1: Static Configuration (Development)
```javascript
const SERVICES = {
  AUTH: 'http://auth-service:8001',
  USER: 'http://user-service:8002',
  WALLET: 'http://wallet-service:8003',
  TRANSACTION: 'http://transaction-service:8004',
  CURRENCY: 'http://currency-service:8005',
  NOTIFICATION: 'http://notification-service:8006'
};
```

### Option 2: Consul / Eureka (Production)
- Dynamic service registration
- Health checks
- Load balancing

---

## API Gateway Routes

### Routing Rules
```javascript
/api/auth/*          → Auth Service (8001)
/api/users/*         → User Service (8002)
/api/wallets/*       → Wallet Service (8003)
/api/transactions/*  → Transaction Service (8004)
/api/currency/*      → Currency Service (8005)
/api/notifications/* → Notification Service (8006)
```

### Authentication Flow
```
1. Client → API Gateway (with JWT)
2. Gateway validates JWT
3. Gateway extracts user info
4. Gateway forwards request with user context
5. Service processes request
6. Gateway returns response to client
```

---

## Event-Driven Architecture

### Message Queue (RabbitMQ)

**Exchanges:**
- `naira-vault.events` - All system events
- `naira-vault.notifications` - Notification events
- `naira-vault.dlx` - Dead letter exchange

**Event Examples:**
```javascript
// User registered event
{
  event: 'user.registered',
  data: {
    userId: 'uuid',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe'
  },
  timestamp: '2025-10-23T...',
  service: 'auth-service'
}

// Transaction completed event
{
  event: 'transaction.completed',
  data: {
    transactionId: 'uuid',
    userId: 'uuid',
    amount: 10000,
    currency: 'NGN',
    type: 'deposit'
  },
  timestamp: '2025-10-23T...',
  service: 'transaction-service'
}
```

---

## Resilience Patterns

### 1. Circuit Breaker
- Prevent cascading failures
- Fall back to cached data
- Retry with exponential backoff

### 2. Health Checks
- Each service exposes `/health`
- Gateway monitors service health
- Auto-restart unhealthy services

### 3. Timeouts
- Request timeouts per service
- Graceful degradation

### 4. Retry Logic
- Automatic retry for transient errors
- Max retry attempts
- Exponential backoff

---

## Security Architecture

### Service-to-Service Authentication
- Internal API keys
- mTLS for production
- Service mesh (Istio) for advanced setups

### API Gateway Security
- JWT validation
- Rate limiting per user/IP
- API key validation
- CORS configuration

### Service-Level Security
- Input validation
- SQL injection prevention
- XSS protection
- Secrets management

---

## Monitoring & Observability

### Logging
- Centralized logging (ELK Stack / CloudWatch)
- Structured logs (JSON)
- Correlation IDs across services

### Metrics
- Prometheus metrics per service
- Grafana dashboards
- Key metrics:
  - Request rate
  - Error rate
  - Response time
  - Service health

### Tracing
- Distributed tracing (Jaeger / Zipkin)
- Request flow visualization
- Performance bottleneck identification

---

## Development Workflow

### Local Development
```bash
# Start infrastructure
docker-compose -f docker-compose.infrastructure.yml up -d

# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Or start individual services
cd services/auth-service && npm run dev
cd services/user-service && npm run dev
# ...
```

### Service Dependencies
```
API Gateway depends on: All services
Auth Service depends on: Notification Service
User Service depends on: Auth Service
Wallet Service depends on: User Service
Transaction Service depends on: Wallet Service, Currency Service
Currency Service depends on: None
Notification Service depends on: None
```

---

## Scalability Considerations

### Horizontal Scaling
- Each service can scale independently
- Stateless services (state in Redis/DB)
- Load balancer distributes traffic

### Caching Strategy
- Redis for:
  - Session data
  - OTP codes
  - Exchange rates
  - User profiles (cache)
  - Transaction history (cache)

### Database Optimization
- Connection pooling per service
- Read replicas for read-heavy services
- Write to master, read from replica

---

## Deployment Strategy

### Blue-Green Deployment
- Zero-downtime deployments
- Quick rollback capability
- Test in green before switching

### Rolling Updates
- Update one instance at a time
- Maintain service availability
- Automated health checks

### Canary Deployments
- Deploy to subset of users
- Monitor metrics
- Gradual rollout

---

## Migration Path

### Phase 1: Monolith to Modular Monolith ✅
- Organize code into modules
- Separate concerns
- Maintain single deployment

### Phase 2: Extract Services (Current)
1. Auth Service (Week 1)
2. Notification Service (Week 1)
3. User Service (Week 2)
4. Wallet Service (Week 2)
5. Transaction Service (Week 3)
6. Currency Service (Week 3)

### Phase 3: Database Separation
- Separate databases per service
- Data migration scripts
- Maintain data consistency

### Phase 4: Advanced Features
- Service mesh
- Auto-scaling
- Multi-region deployment

---

## Technology Stack

### Services
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** JavaScript (CommonJS)
- **Process Manager:** PM2

### Communication
- **Sync:** REST APIs (HTTP)
- **Async:** RabbitMQ / Redis Pub/Sub
- **Data Format:** JSON

### Data Storage
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **Message Queue:** RabbitMQ 3

### DevOps
- **Containers:** Docker
- **Orchestration:** Docker Compose (dev), Kubernetes (prod)
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus + Grafana

---

## Service Communication Patterns

### 1. Request-Response (Synchronous)
```javascript
// API Gateway → Auth Service
const response = await axios.post(
  'http://auth-service:8001/auth/validate-token',
  { token }
);
```

### 2. Event-Driven (Asynchronous)
```javascript
// Auth Service publishes event
publishEvent('user.registered', {
  userId: user.id,
  email: user.email
});

// Notification Service listens
subscribeToEvent('user.registered', async (data) => {
  await sendWelcomeEmail(data.email);
});
```

### 3. API Composition
```javascript
// API Gateway composes multiple service calls
const [user, wallets, transactions] = await Promise.all([
  userService.getProfile(userId),
  walletService.getWallets(userId),
  transactionService.getRecent(userId)
]);
```

---

## Error Handling

### Service-Level Errors
```javascript
{
  success: false,
  error: {
    code: 'SERVICE_ERROR_CODE',
    message: 'User friendly message',
    service: 'auth-service',
    timestamp: '...'
  }
}
```

### Gateway-Level Errors
```javascript
{
  success: false,
  error: {
    code: 'GATEWAY_ERROR_CODE',
    message: 'Service unavailable',
    retryAfter: 30,
    timestamp: '...'
  }
}
```

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| API Gateway Response | < 100ms | - |
| Auth Service Login | < 500ms | - |
| Transaction Processing | < 1s | - |
| Currency Conversion | < 200ms | - |
| 99th Percentile | < 2s | - |

---

## Advantages of Microservices

### Benefits
✅ **Independent Deployment** - Deploy services separately  
✅ **Technology Flexibility** - Different tech per service  
✅ **Scalability** - Scale services independently  
✅ **Fault Isolation** - One service failure doesn't crash system  
✅ **Team Autonomy** - Teams own specific services  
✅ **Faster Development** - Parallel development  

### Challenges
⚠️ **Complexity** - More moving parts  
⚠️ **Testing** - Integration testing harder  
⚠️ **Data Consistency** - Distributed transactions  
⚠️ **Network Latency** - Inter-service calls  
⚠️ **Monitoring** - Need centralized observability  

---

## Configuration Management

### Environment Variables Per Service

**Auth Service:**
```env
SERVICE_NAME=auth-service
PORT=8001
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
RABBITMQ_URL=amqp://...
JWT_SECRET=...
```

**Shared Configuration:**
- Centralized config service (Consul)
- Environment-specific configs
- Secrets management (Vault)

---

## Testing Strategy

### Unit Tests
- Test individual functions
- Mock dependencies
- 80%+ coverage per service

### Integration Tests
- Test service interactions
- Test API contracts
- Database integration

### End-to-End Tests
- Test complete user flows
- Through API Gateway
- Real dependencies (test environment)

### Contract Tests
- Service interface contracts
- Ensure compatibility
- Prevent breaking changes

---

## Deployment Checklist

### Per Service
- [ ] Dockerfile created
- [ ] Health check endpoint
- [ ] Environment variables documented
- [ ] Tests passing
- [ ] Logging configured
- [ ] Metrics exposed
- [ ] Error handling implemented

### Infrastructure
- [ ] Docker Compose configured
- [ ] Database migrations
- [ ] Redis configured
- [ ] RabbitMQ configured
- [ ] API Gateway routes configured

---

## Future Enhancements

- [ ] GraphQL API Gateway
- [ ] gRPC for inter-service communication
- [ ] Kubernetes deployment
- [ ] Service mesh (Istio)
- [ ] Distributed tracing (Jaeger)
- [ ] Centralized logging (ELK)
- [ ] Auto-scaling policies
- [ ] Multi-region deployment

---

**Status:** 🚧 In Progress  
**Target Completion:** End of Week 3  
**Current Phase:** Phase 2 - Extract Services  

---

This architecture provides a scalable, maintainable foundation for the Naira Vault Ledger System, supporting future growth and feature additions.

