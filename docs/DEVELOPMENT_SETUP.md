# Naira Vault Ledger System - Development Setup Guide

## Prerequisites

Before setting up the development environment, ensure you have the following installed:

### Required Software
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Docker & Docker Compose** - [Download](https://www.docker.com/products/docker-desktop)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (Recommended) - [Download](https://code.visualstudio.com/)

### Optional Tools
- **Postman** - API testing
- **DBeaver** - Database management
- **Redis Commander** - Redis management
- **pgAdmin** - PostgreSQL management

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd naira-vault-ledger
```

### 2. Start with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Database**: localhost:5432
- **Redis**: localhost:6379

## Development Environment Setup

### Frontend Development

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Environment Configuration
Create `.env.local` file:
```env
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 3. Start Development Server
```bash
npm run dev
```

#### 4. Build for Production
```bash
npm run build
npm run preview
```

### Backend Development

#### 1. Navigate to Backend Directory
```bash
cd backend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
Create `.env` file:
```env
NODE_ENV=development
PORT=8000
DATABASE_URL=postgresql://naira_vault:naira_vault_password@localhost:5432/naira_vault_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

#### 4. Start Development Server
```bash
npm run dev
```

#### 5. Run Tests
```bash
npm test
```

## Database Setup

### PostgreSQL Setup

#### 1. Using Docker (Recommended)
```bash
# Start PostgreSQL container
docker run --name naira-vault-postgres \
  -e POSTGRES_DB=naira_vault_db \
  -e POSTGRES_USER=naira_vault \
  -e POSTGRES_PASSWORD=naira_vault_password \
  -p 5432:5432 \
  -d postgres:15-alpine

# Run database migrations
npm run migrate
```

#### 2. Local Installation
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Install PostgreSQL (Ubuntu)
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
createdb naira_vault_db
```

### Database Migrations

#### 1. Run Initial Migration
```bash
cd backend
npm run migrate
```

#### 2. Create New Migration
```bash
npm run migrate:create -- --name add_new_table
```

#### 3. Rollback Migration
```bash
npm run migrate:rollback
```

## Redis Setup

### Using Docker (Recommended)
```bash
# Start Redis container
docker run --name naira-vault-redis \
  -p 6379:6379 \
  -d redis:7-alpine
```

### Local Installation
```bash
# Install Redis (macOS)
brew install redis
brew services start redis

# Install Redis (Ubuntu)
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## Development Workflow

### 1. Code Structure
```
naira-vault-ledger/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility functions
│   └── integrations/     # External integrations
├── backend/              # Backend API
│   ├── src/              # Source code
│   ├── sql/              # Database scripts
│   └── tests/            # Test files
├── docs/                 # Documentation
├── docker/               # Docker configurations
└── docker-compose.yml    # Multi-container setup
```

### 2. Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
# Merge after review
```

### 3. Code Quality

#### ESLint Configuration
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

#### Prettier Configuration
```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

### 4. Testing

#### Frontend Testing
```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

#### Backend Testing
```bash
cd backend

# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run tests with coverage
npm run test:coverage
```

## Docker Development

### 1. Development Containers
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Execute commands in containers
docker-compose exec frontend npm run dev
docker-compose exec backend npm run dev
```

### 2. Database Containers
```bash
# Start only database services
docker-compose up -d postgres redis

# Connect to database
docker-compose exec postgres psql -U naira_vault -d naira_vault_db

# Connect to Redis
docker-compose exec redis redis-cli
```

### 3. Container Management
```bash
# Rebuild containers
docker-compose build --no-cache

# Remove containers and volumes
docker-compose down -v

# View container status
docker-compose ps
```

## Environment Variables

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=Naira Vault Ledger
VITE_APP_VERSION=1.0.0
```

### Backend (.env)
```env
NODE_ENV=development
PORT=8000
DATABASE_URL=postgresql://naira_vault:naira_vault_password@localhost:5432/naira_vault_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=debug
```

## Debugging

### 1. Frontend Debugging
```bash
# Start with debug mode
npm run dev -- --debug

# Use browser dev tools
# Set breakpoints in VS Code
# Use React DevTools extension
```

### 2. Backend Debugging
```bash
# Start with debug mode
npm run dev:debug

# Use VS Code debugger
# Set breakpoints in code
# Use Postman for API testing
```

### 3. Database Debugging
```bash
# View database logs
docker-compose logs postgres

# Connect to database
docker-compose exec postgres psql -U naira_vault -d naira_vault_db

# View Redis logs
docker-compose logs redis
```

## Performance Optimization

### 1. Frontend Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Optimize images
npm run optimize:images

# Check performance
npm run lighthouse
```

### 2. Backend Optimization
```bash
# Profile performance
npm run profile

# Monitor memory usage
npm run monitor:memory

# Check database performance
npm run db:analyze
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port
lsof -i :3000
lsof -i :8000

# Kill process
kill -9 <PID>
```

#### 2. Database Connection Issues
```bash
# Check database status
docker-compose ps postgres

# Restart database
docker-compose restart postgres

# Check database logs
docker-compose logs postgres
```

#### 3. Redis Connection Issues
```bash
# Check Redis status
docker-compose ps redis

# Restart Redis
docker-compose restart redis

# Check Redis logs
docker-compose logs redis
```

#### 4. Build Issues
```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Clear Docker cache
docker system prune -a
```

### 5. Environment Issues
```bash
# Check environment variables
echo $NODE_ENV
echo $DATABASE_URL

# Verify .env files
cat .env
cat .env.local
```

## Production Deployment

### 1. Build for Production
```bash
# Build frontend
npm run build

# Build backend
cd backend
npm run build
```

### 2. Docker Production Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production environment
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Environment Configuration
```bash
# Set production environment variables
export NODE_ENV=production
export DATABASE_URL=your_production_database_url
export REDIS_URL=your_production_redis_url
```

## Monitoring and Logging

### 1. Application Logs
```bash
# View application logs
docker-compose logs -f frontend
docker-compose logs -f backend

# View specific service logs
docker-compose logs -f --tail=100 backend
```

### 2. Database Monitoring
```bash
# Monitor database performance
docker-compose exec postgres psql -U naira_vault -d naira_vault_db -c "SELECT * FROM pg_stat_activity;"

# Check database size
docker-compose exec postgres psql -U naira_vault -d naira_vault_db -c "SELECT pg_size_pretty(pg_database_size('naira_vault_db'));"
```

### 3. Redis Monitoring
```bash
# Monitor Redis performance
docker-compose exec redis redis-cli info

# Check Redis memory usage
docker-compose exec redis redis-cli info memory
```

## Security Considerations

### 1. Environment Security
```bash
# Never commit .env files
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# Use strong secrets
openssl rand -base64 32
```

### 2. Database Security
```bash
# Use strong passwords
# Enable SSL connections
# Restrict network access
# Regular security updates
```

### 3. API Security
```bash
# Use HTTPS in production
# Implement rate limiting
# Validate all inputs
# Use proper authentication
```

## Support and Resources

### 1. Documentation
- **API Documentation**: `/docs/API_DOCUMENTATION.md`
- **Architecture**: `/docs/ARCHITECTURE.md`
- **Deployment Guide**: `/docs/DEPLOYMENT.md`

### 2. Community
- **GitHub Issues**: Report bugs and feature requests
- **Slack Channel**: #nairavault-dev
- **Email**: dev@nairavault.com

### 3. Learning Resources
- **React Documentation**: https://react.dev/
- **Node.js Documentation**: https://nodejs.org/docs/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Docker Documentation**: https://docs.docker.com/

---

This development setup guide provides comprehensive instructions for setting up, developing, and maintaining the Naira Vault Ledger System. Follow these guidelines to ensure a smooth development experience and maintain code quality throughout the project lifecycle.
