#!/bin/bash

# Naira Vault Ledger - Environment Setup Script

echo "🔧 Setting up environment variables for Naira Vault Ledger..."

# Check if .env files already exist
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

if [ -f "backend/.env" ]; then
    echo "⚠️  backend/.env file already exists. Backing up to backend/.env.backup"
    cp backend/.env backend/.env.backup
fi

# Copy sample files
echo "📋 Copying environment sample files..."

if [ -f "env.sample" ]; then
    cp env.sample .env
    echo "✅ Created .env from env.sample"
else
    echo "❌ env.sample not found. Please create it first."
    exit 1
fi

if [ -f "backend/.env.sample" ]; then
    cp backend/.env.sample backend/.env
    echo "✅ Created backend/.env from backend/.env.sample"
else
    echo "❌ backend/.env.sample not found. Please create it first."
    exit 1
fi

# Generate secure secrets for development
echo "🔐 Generating secure secrets for development..."

# Generate JWT secrets
JWT_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
SESSION_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

# Update .env files with generated secrets
echo "🔑 Updating .env files with generated secrets..."

# Update frontend .env
sed -i.bak "s/your-super-secret-jwt-key-change-in-production/$JWT_SECRET/g" .env
sed -i.bak "s/your-refresh-token-secret/$JWT_REFRESH_SECRET/g" .env
sed -i.bak "s/your-session-secret-key/$SESSION_SECRET/g" .env
sed -i.bak "s/your-32-character-encryption-key/$ENCRYPTION_KEY/g" .env

# Update backend .env
sed -i.bak "s/your-super-secret-jwt-key-change-in-production/$JWT_SECRET/g" backend/.env
sed -i.bak "s/your-refresh-token-secret/$JWT_REFRESH_SECRET/g" backend/.env
sed -i.bak "s/your-session-secret-key/$SESSION_SECRET/g" backend/.env
sed -i.bak "s/your-32-character-encryption-key/$ENCRYPTION_KEY/g" backend/.env

# Clean up backup files
rm -f .env.bak backend/.env.bak

echo "✅ Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review and update the .env files with your actual API keys"
echo "2. Update API credentials in .env"
echo "3. Update payment gateway credentials in backend/.env"
echo "4. Update email/SMS service credentials in backend/.env"
echo ""
echo "🔒 Security notes:"
echo "- Never commit .env files to version control"
echo "- Use strong, unique secrets for production"
echo "- Rotate secrets regularly"
echo "- Use a secrets management service in production"
echo ""
echo "📁 Files created:"
echo "   - .env (frontend environment variables)"
echo "   - backend/.env (backend environment variables)"
echo ""
echo "🚀 You can now start the development environment:"
echo "   docker-compose -f docker-compose.dev.yml up -d"
