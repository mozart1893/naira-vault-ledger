# Naira Vault Ledger System

A comprehensive multi-currency digital wallet and ledger system built with modern web technologies.

## Project Overview

The Naira Vault Ledger System is a fintech application that provides:
- Multi-currency wallet management (NGN, USD, GBP, EUR)
- Real-time transaction processing
- Currency conversion capabilities
- Comprehensive audit trails
- Secure user authentication and KYC verification

## Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database (port 5444)
- **Redis** - Caching layer

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancer

## Getting Started

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd naira-vault-ledger
```

2. **Quick Start with Docker Compose**
```bash
# Option 1: Use the setup script (recommended)
./scripts/dev-setup.sh

# Option 2: Manual setup for development
docker-compose -f docker-compose.dev.yml up --build -d

# Option 3: For production build
docker-compose up --build -d
```

3. **Access the application**
- User Frontend: http://localhost:3000
- Admin Portal: http://localhost:3002 (separate service)
- Backend API: http://localhost:8000
- Database: localhost:5444

### Troubleshooting

If you encounter build issues (especially on ARM64/M1 Macs), try:

```bash
# Use development setup
docker-compose -f docker-compose.dev.yml up -d

# Or clean and rebuild
docker system prune -a
docker-compose build --no-cache
```

See [Troubleshooting Guide](docs/TROUBLESHOOTING.md) for detailed solutions.

### Development Setup

1. **Start development server**
```bash
npm run dev
```

2. **Build for production**
```bash
npm run build
```

3. **Preview production build**
```bash
npm run preview
```

## Project Structure

```
naira-vault-ledger/
├── admin-portal/                   # Admin Portal (Separate Service - Port 3002)
│   ├── src/                       # Admin React application
│   │   ├── pages/                 # Admin pages (Dashboard, Users, KYC, Analytics)
│   │   ├── components/            # Admin components
│   │   ├── contexts/              # Admin auth context
│   │   └── lib/                   # Admin API client
│   ├── package.json               # Admin dependencies
│   └── vite.config.ts             # Configured for port 3002
│
├── backend/                        # Monolithic Backend (Production-Ready)
│   ├── src/                       # Backend source code
│   │   ├── controllers/           # Business logic
│   │   ├── routes/                # API endpoints
│   │   ├── services/              # Email, SMS services
│   │   ├── utils/                 # Utilities (OTP, logger)
│   │   └── index.js              # Server entry point
│   └── sql/                       # Database schema
│
├── src/                           # Frontend (React + TypeScript)
│   ├── components/                # React components
│   │   ├── ui/                    # shadcn/ui components
│   │   └── ...                    # Custom components
│   ├── pages/                     # Page components (Landing, Register, Login, Dashboard)
│   ├── contexts/                  # React contexts (Auth)
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility functions
│   └── main.tsx                   # Application entry point
│
├── microservices-implementation/  # Microservices Architecture (Scalable)
│   ├── services/                  # 7 Microservices + Shared libraries
│   │   ├── shared/                # Common libraries
│   │   ├── api-gateway/           # Request routing (8000)
│   │   ├── auth-service/          # Authentication (8001)
│   │   ├── user-service/          # User profiles (8002)
│   │   ├── wallet-service/        # Wallets (8003)
│   │   ├── transaction-service/   # Transactions (8004)
│   │   ├── currency-service/      # Exchange rates (8005)
│   │   └── notification-service/  # Email/SMS (8006)
│   ├── docker-compose.microservices.yml
│   └── README.md                  # Microservices documentation
│
├── docs/                          # Complete Documentation (19 files)
│   ├── README.md                  # Documentation index
│   ├── QUICK_START.md             # Quick setup guide
│   ├── USER_REGISTRATION.md       # Registration feature
│   ├── MICROSERVICES_ARCHITECTURE.md
│   └── ... (15 more guides)
│
├── docker-compose.dev.yml         # Monolith development setup
└── README.md                      # This file
```

## Features

### Core Functionality
- **Multi-Currency Wallets** - Support for NGN, USD, GBP, EUR
- **Transaction Management** - Deposits, withdrawals, transfers, conversions
- **Real-time Balance Updates** - Live balance tracking
- **Currency Conversion** - Cross-currency transactions
- **Transaction History** - Comprehensive audit trails

### Security Features
- **User Authentication** - Secure login system
- **KYC Verification** - Identity verification with BVN/NIN
- **Audit Logging** - Complete transaction audit trails
- **Data Encryption** - End-to-end data protection

### User Experience
- **Responsive Design** - Mobile and desktop optimized
- **Real-time Updates** - Live transaction notifications
- **Intuitive Interface** - Clean and modern UI
- **Accessibility** - WCAG compliant design

## API Documentation

The backend API provides endpoints for:
- User authentication and management
- Wallet operations (create, read, update)
- Transaction processing
- Currency conversion
- Audit logging

## Database Schema

The system uses a comprehensive database schema with tables for:
- Users and authentication
- Wallets and balances
- Transactions and ledger entries
- Currency conversions
- Audit logs
- Payment methods

## Deployment

### Production Deployment

1. **Build the application**
```bash
npm run build
```

2. **Deploy with Docker**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

1. **Copy the sample environment file:**
```bash
cp env.sample .env
```

2. **Update the values in `.env`:**
```bash
# Frontend variables (Vite)
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Naira Vault Ledger

# Backend variables
DATABASE_URL=postgresql://naira_vault:naira_vault_password@localhost:5432/naira_vault_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
```

3. **For backend development, also create:**
```bash
cp backend/.env.sample backend/.env
```

**Important:** Never commit `.env` files to version control. Use `env.sample` as a template.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Documentation

Comprehensive documentation is available in the `/docs` directory, organized by category:

### 📚 Quick Links

**Getting Started:**
- **[START_HERE.md](./START_HERE.md)** - Quick 2-minute start
- **[Monolith Startup Guide](./docs/monolith/MONOLITH_STARTUP_GUIDE.md)** - Complete monolith setup
- **[Microservices Startup Guide](./docs/microservices/MICROSERVICES_STARTUP_GUIDE.md)** - Complete microservices setup

**Core Documentation:**
- **[User Registration](./docs/features/USER_REGISTRATION.md)** - Registration feature details
- **[API Documentation](./docs/architecture/API_DOCUMENTATION.md)** - Complete API reference
- **[Troubleshooting](./docs/general/TROUBLESHOOTING.md)** - Common issues and solutions

**Architecture:**
- **[System Architecture](./docs/architecture/ARCHITECTURE.md)** - Overall design
- **[Microservices Architecture](./docs/microservices/MICROSERVICES_ARCHITECTURE.md)** - Scalability design
- **[Deployment Guide](./docs/general/HYBRID_DEPLOYMENT_GUIDE.md)** - Deployment options

### 📖 Full Documentation Index
See **[docs/README.md](./docs/README.md)** for complete categorized documentation index.

**Documentation is organized into:**
- `docs/monolith/` - Monolithic backend documentation (3 files)
- `docs/microservices/` - Microservices documentation (10 files)
- `docs/features/` - Feature implementation guides (5 files)
- `docs/architecture/` - System architecture and API (2 files)
- `docs/general/` - General guides and overviews (12 files)

## Architecture

This project includes **TWO complete implementations**:

### **1. Monolithic Backend** (`/backend`) - Recommended for Development
- **Port:** 8000
- **Status:** ✅ Production-ready, fully functional
- **Best For:** Development, MVP, small-medium scale (<10k users)
- **Runs On:** Mac, Linux, Windows

### **2. Microservices** (`/microservices-implementation`) - Ready for Scale
- **Ports:** 8000-8006 (7 services)
- **Status:** ✅ Complete implementation, production-ready (Linux)
- **Best For:** Production scale, team scaling (5+ devs), 10k+ users
- **Runs On:** Linux servers, Cloud platforms, Kubernetes

Both architectures share the same database schema and frontend. See **[docs/general/HYBRID_DEPLOYMENT_GUIDE.md](./docs/general/HYBRID_DEPLOYMENT_GUIDE.md)** for details.

## Support

For support and questions:
- **Quick Start:** [START_HERE.md](./START_HERE.md)
- **Troubleshooting:** [docs/general/TROUBLESHOOTING.md](./docs/general/TROUBLESHOOTING.md)
- **Complete Documentation:** [docs/README.md](./docs/README.md)
- **Service Logs:** Check `backend/logs/` for monolith, Docker logs for microservices
- **Create an issue:** in the repository for bugs or feature requests

---

**Note**: This is a demonstration project for educational purposes. Do not use in production without proper security audits and compliance reviews.