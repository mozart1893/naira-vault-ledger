# Naira Vault Ledger System - Architecture Documentation

## System Overview

The Naira Vault Ledger System is a comprehensive fintech application designed to provide multi-currency digital wallet services with robust transaction processing, audit trails, and compliance features.

## Architecture Principles

### 1. Microservices Architecture
- **Service Separation**: Each business domain is handled by dedicated services
- **Independent Deployment**: Services can be deployed and scaled independently
- **Fault Isolation**: Failure in one service doesn't affect others
- **Technology Diversity**: Each service can use the most appropriate technology

### 2. Event-Driven Design
- **Asynchronous Processing**: Non-blocking transaction processing
- **Event Sourcing**: Complete audit trail of all system events
- **Eventual Consistency**: Distributed system consistency model
- **Scalability**: Horizontal scaling through event processing

### 3. Security-First Approach
- **Zero Trust Architecture**: All communications are authenticated and authorized
- **Data Encryption**: End-to-end encryption for sensitive data
- **Audit Logging**: Comprehensive logging of all system activities
- **Compliance**: Built-in compliance with financial regulations

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Web App (React)  │  Mobile App  │  Admin Portal  │  API     │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  Load Balancer  │  Rate Limiting  │  Authentication  │  SSL    │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  User Service  │  Wallet Service  │  Transaction Service     │
│  Auth Service  │  Ledger Service  │  FX Service              │
│  KYC Service   │  Notification    │  Audit Service            │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL  │  Redis Cache  │  Message Queue  │  File Storage │
└─────────────────────────────────────────────────────────────────┘
```

### Service Architecture

#### 1. User Service
**Responsibilities:**
- User registration and authentication
- Profile management
- KYC verification
- Account settings

**Key Components:**
- User registration/authentication endpoints
- KYC verification workflows
- Profile management APIs
- Password reset functionality

#### 2. Wallet Service
**Responsibilities:**
- Multi-currency wallet management
- Balance tracking and updates
- Wallet creation and configuration
- Hold management

**Key Components:**
- Wallet CRUD operations
- Balance calculation logic
- Hold management system
- Currency support

#### 3. Transaction Service
**Responsibilities:**
- Transaction processing
- Transaction status management
- Transaction history
- Transaction validation

**Key Components:**
- Transaction processing engine
- Status management
- Validation rules
- History tracking

#### 4. Ledger Service
**Responsibilities:**
- Double-entry bookkeeping
- Balance calculations
- Audit trail maintenance
- Financial reporting

**Key Components:**
- Double-entry system
- Balance calculation engine
- Audit trail generation
- Financial reporting

#### 5. FX Service
**Responsibilities:**
- Currency conversion
- Exchange rate management
- Cross-currency transactions
- Rate caching

**Key Components:**
- Exchange rate APIs
- Conversion calculations
- Rate caching system
- Cross-currency processing

#### 6. Notification Service
**Responsibilities:**
- Transaction notifications
- System alerts
- User communications
- Multi-channel delivery

**Key Components:**
- Email notifications
- SMS notifications
- Push notifications
- In-app notifications

## Database Architecture

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bvn VARCHAR(11),
    nin VARCHAR(11),
    kyc_status kyc_status DEFAULT 'pending',
    account_type account_type DEFAULT 'individual',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Wallets Table
```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    currency currency_code NOT NULL,
    ledger_balance DECIMAL(15,2) DEFAULT 0.00,
    available_balance DECIMAL(15,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Transactions Table
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    transaction_type transaction_type NOT NULL,
    status transaction_status DEFAULT 'pending',
    amount DECIMAL(15,2) NOT NULL,
    currency currency_code NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Ledger Entries Table
```sql
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY,
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    entry_type ledger_entry_type NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Design Principles

#### 1. ACID Compliance
- **Atomicity**: All operations in a transaction succeed or fail together
- **Consistency**: Database remains in a valid state after each transaction
- **Isolation**: Concurrent transactions don't interfere with each other
- **Durability**: Committed transactions persist even after system failures

#### 2. Double-Entry Bookkeeping
- Every transaction creates at least two ledger entries
- Total debits must equal total credits
- Complete audit trail for all financial activities
- Immutable ledger entries

#### 3. Data Integrity
- Foreign key constraints
- Check constraints for business rules
- Unique constraints for critical fields
- Not null constraints for required fields

## Security Architecture

### Authentication & Authorization

#### 1. Multi-Factor Authentication
- Password-based authentication
- SMS/Email OTP verification
- Biometric authentication (mobile)
- Hardware token support

#### 2. Role-Based Access Control (RBAC)
- User roles and permissions
- Resource-based access control
- API endpoint protection
- Admin privilege management

#### 3. Session Management
- JWT-based authentication
- Secure session storage
- Session timeout management
- Concurrent session limits

### Data Protection

#### 1. Encryption
- **At Rest**: AES-256 encryption for sensitive data
- **In Transit**: TLS 1.3 for all communications
- **Application Level**: Field-level encryption for PII
- **Key Management**: Secure key storage and rotation

#### 2. Data Masking
- PII masking in logs
- Sensitive data redaction
- Audit trail protection
- Development data sanitization

#### 3. Compliance
- **PCI DSS**: Payment card data protection
- **GDPR**: Data privacy and protection
- **SOX**: Financial reporting compliance
- **Local Regulations**: Nigerian financial regulations

## Deployment Architecture

### Container Orchestration

#### Docker Containers
- **Frontend**: React application in Nginx
- **Backend**: Node.js API services
- **Database**: PostgreSQL with persistent storage
- **Cache**: Redis for session and data caching
- **Message Queue**: Redis for asynchronous processing

#### Docker Compose Services
```yaml
services:
  frontend:     # React app with Nginx
  backend:      # Node.js API services
  postgres:     # Primary database
  redis:        # Cache and message queue
  nginx:         # Load balancer and reverse proxy
  prometheus:   # Monitoring
  grafana:      # Dashboards
```

### Infrastructure Components

#### 1. Load Balancing
- **Nginx**: Reverse proxy and load balancer
- **Health Checks**: Service health monitoring
- **SSL Termination**: HTTPS encryption
- **Rate Limiting**: API protection

#### 2. Monitoring & Logging
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **ELK Stack**: Log aggregation and analysis
- **Alerting**: Automated incident response

#### 3. Backup & Recovery
- **Database Backups**: Automated daily backups
- **Point-in-Time Recovery**: Transaction log backups
- **Disaster Recovery**: Multi-region deployment
- **Data Retention**: Compliance-driven retention policies

## API Architecture

### RESTful API Design

#### 1. Resource-Based URLs
```
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}

GET    /api/wallets
POST   /api/wallets
GET    /api/wallets/{id}
PUT    /api/wallets/{id}

GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/{id}
```

#### 2. HTTP Status Codes
- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

#### 3. API Versioning
- **URL Versioning**: `/api/v1/`, `/api/v2/`
- **Header Versioning**: `Accept: application/vnd.api+json;version=1`
- **Backward Compatibility**: Maintained for at least 2 versions
- **Deprecation Policy**: 6-month notice for breaking changes

### API Security

#### 1. Authentication
- **JWT Tokens**: Stateless authentication
- **Refresh Tokens**: Long-lived session management
- **Token Expiration**: Configurable token lifetimes
- **Token Revocation**: Immediate access revocation

#### 2. Rate Limiting
- **Per-IP Limits**: 100 requests per minute
- **Per-User Limits**: 1000 requests per hour
- **Burst Protection**: Temporary rate limit increases
- **Whitelist Support**: Exempted IPs and users

#### 3. Input Validation
- **Schema Validation**: JSON schema validation
- **Sanitization**: Input sanitization and escaping
- **Type Checking**: Strict type validation
- **Business Rules**: Custom validation logic

## Performance Architecture

### Caching Strategy

#### 1. Multi-Level Caching
- **Browser Cache**: Static asset caching
- **CDN Cache**: Global content delivery
- **Application Cache**: In-memory caching
- **Database Cache**: Query result caching

#### 2. Cache Invalidation
- **TTL-Based**: Time-to-live expiration
- **Event-Based**: Cache invalidation on data changes
- **Manual**: Administrative cache clearing
- **Versioning**: Cache version management

### Database Optimization

#### 1. Indexing Strategy
- **Primary Keys**: Clustered indexes
- **Foreign Keys**: Non-clustered indexes
- **Query Patterns**: Optimized for common queries
- **Composite Indexes**: Multi-column indexes

#### 2. Query Optimization
- **Query Analysis**: Performance monitoring
- **Query Rewriting**: Optimized query generation
- **Connection Pooling**: Efficient connection management
- **Read Replicas**: Read-only database copies

### Scalability Design

#### 1. Horizontal Scaling
- **Stateless Services**: No server-side session storage
- **Load Distribution**: Even load distribution
- **Auto-Scaling**: Dynamic resource allocation
- **Service Mesh**: Inter-service communication

#### 2. Vertical Scaling
- **Resource Monitoring**: CPU, memory, disk usage
- **Performance Tuning**: Database and application optimization
- **Capacity Planning**: Growth prediction and planning
- **Resource Allocation**: Optimal resource distribution

## Monitoring & Observability

### Metrics Collection

#### 1. Application Metrics
- **Response Times**: API endpoint performance
- **Throughput**: Requests per second
- **Error Rates**: Failed request percentages
- **User Activity**: User engagement metrics

#### 2. Infrastructure Metrics
- **CPU Usage**: Server utilization
- **Memory Usage**: RAM consumption
- **Disk I/O**: Storage performance
- **Network I/O**: Network traffic

### Logging Strategy

#### 1. Structured Logging
- **JSON Format**: Machine-readable logs
- **Correlation IDs**: Request tracing
- **Log Levels**: Debug, info, warn, error
- **Contextual Data**: Request and user context

#### 2. Log Aggregation
- **Centralized Logging**: Single log repository
- **Log Parsing**: Structured log analysis
- **Log Retention**: Compliance-driven retention
- **Log Security**: Sensitive data protection

### Alerting System

#### 1. Alert Types
- **Critical Alerts**: System failures
- **Warning Alerts**: Performance degradation
- **Info Alerts**: System status updates
- **Custom Alerts**: Business-specific alerts

#### 2. Alert Channels
- **Email**: Critical system alerts
- **SMS**: Emergency notifications
- **Slack**: Team notifications
- **PagerDuty**: On-call management

## Disaster Recovery

### Backup Strategy

#### 1. Database Backups
- **Full Backups**: Daily complete backups
- **Incremental Backups**: Hourly incremental backups
- **Transaction Log Backups**: Continuous log backups
- **Point-in-Time Recovery**: Specific time recovery

#### 2. Application Backups
- **Code Repositories**: Git repository backups
- **Configuration Files**: Environment configuration
- **Docker Images**: Container image backups
- **Documentation**: System documentation

### Recovery Procedures

#### 1. RTO/RPO Targets
- **Recovery Time Objective (RTO)**: 4 hours
- **Recovery Point Objective (RPO)**: 1 hour
- **Data Loss Tolerance**: Minimal data loss
- **Service Availability**: 99.9% uptime

#### 2. Recovery Testing
- **Regular Testing**: Monthly recovery tests
- **Documentation**: Detailed recovery procedures
- **Team Training**: Recovery process training
- **Automation**: Automated recovery scripts

## Compliance & Governance

### Regulatory Compliance

#### 1. Financial Regulations
- **CBN Guidelines**: Central Bank of Nigeria regulations
- **PCI DSS**: Payment card industry standards
- **SOX Compliance**: Sarbanes-Oxley Act compliance
- **GDPR**: General Data Protection Regulation

#### 2. Audit Requirements
- **Audit Trails**: Complete transaction history
- **Access Logs**: User access tracking
- **Change Logs**: System modification tracking
- **Compliance Reports**: Regulatory reporting

### Data Governance

#### 1. Data Classification
- **Public Data**: Non-sensitive information
- **Internal Data**: Company-internal information
- **Confidential Data**: Sensitive business information
- **Restricted Data**: Highly sensitive information

#### 2. Data Lifecycle
- **Data Creation**: Secure data entry
- **Data Processing**: Secure data handling
- **Data Storage**: Encrypted data storage
- **Data Disposal**: Secure data deletion

## Future Enhancements

### Planned Features

#### 1. Advanced Analytics
- **Machine Learning**: Fraud detection algorithms
- **Predictive Analytics**: User behavior analysis
- **Risk Assessment**: Automated risk scoring
- **Business Intelligence**: Advanced reporting

#### 2. Integration Capabilities
- **Open Banking**: Third-party API integrations
- **Blockchain**: Cryptocurrency support
- **AI/ML**: Intelligent automation
- **IoT**: Internet of Things integration

### Scalability Roadmap

#### 1. Microservices Evolution
- **Service Mesh**: Advanced service communication
- **Event Streaming**: Real-time event processing
- **CQRS**: Command Query Responsibility Segregation
- **Event Sourcing**: Complete event history

#### 2. Cloud Migration
- **Multi-Cloud**: Multiple cloud provider support
- **Serverless**: Function-as-a-Service deployment
- **Container Orchestration**: Kubernetes deployment
- **Edge Computing**: Distributed processing

---

This architecture documentation provides a comprehensive overview of the Naira Vault Ledger System's design, implementation, and future roadmap. The system is designed to be scalable, secure, and compliant with financial regulations while providing excellent user experience and operational efficiency.
