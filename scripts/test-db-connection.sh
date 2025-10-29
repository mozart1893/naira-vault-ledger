#!/bin/bash

# Naira Vault Ledger - Database Connection Test Script

echo "🔍 Testing database connection on port 5444..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Check if the database container is running
if ! docker-compose -f docker-compose.dev.yml ps postgres | grep -q "Up"; then
    echo "🚀 Starting database container..."
    docker-compose -f docker-compose.dev.yml up -d postgres
    echo "⏳ Waiting for database to be ready..."
    sleep 10
fi

# Test connection using psql
echo "🔗 Testing PostgreSQL connection..."
if docker-compose -f docker-compose.dev.yml exec -T postgres psql -U naira_vault -d naira_vault_db -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Database connection successful!"
    echo ""
    echo "📊 Database Information:"
    docker-compose -f docker-compose.dev.yml exec -T postgres psql -U naira_vault -d naira_vault_db -c "SELECT version();"
    echo ""
    echo "🗂️  Available Tables:"
    docker-compose -f docker-compose.dev.yml exec -T postgres psql -U naira_vault -d naira_vault_db -c "\dt"
    echo ""
    echo "🌐 Database is accessible on:"
    echo "   Host: localhost"
    echo "   Port: 5444"
    echo "   Database: naira_vault_db"
    echo "   Username: naira_vault"
    echo "   Password: naira_vault_password"
    echo ""
    echo "🔧 Connection string:"
    echo "   postgresql://naira_vault:naira_vault_password@localhost:5444/naira_vault_db"
else
    echo "❌ Database connection failed!"
    echo ""
    echo "🔍 Troubleshooting steps:"
    echo "1. Check if the database container is running:"
    echo "   docker-compose -f docker-compose.dev.yml ps"
    echo ""
    echo "2. Check database logs:"
    echo "   docker-compose -f docker-compose.dev.yml logs postgres"
    echo ""
    echo "3. Restart the database:"
    echo "   docker-compose -f docker-compose.dev.yml restart postgres"
    echo ""
    echo "4. Check if port 5444 is available:"
    echo "   lsof -i :5444"
    exit 1
fi

echo "✅ Database connection test completed successfully!"
