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
- **PostgreSQL** - Primary database
- **Supabase** - Backend-as-a-Service
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
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Database: localhost:5432

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
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   └── ...             # Custom components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── integrations/       # External service integrations
│   └── main.tsx           # Application entry point
├── supabase/               # Supabase configuration
├── docker/                 # Docker configurations
├── docs/                   # Documentation
└── docker-compose.yml     # Multi-container setup
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
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000/api

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

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a demonstration project for educational purposes. Do not use in production without proper security audits and compliance reviews.