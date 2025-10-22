#!/bin/bash

# Naira Vault Ledger - Development Setup Script

echo "🚀 Setting up Naira Vault Ledger Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose -f docker-compose.dev.yml down -v

# Remove any existing images to force rebuild
echo "🗑️  Removing existing images..."
docker rmi naira-vault-ledger-frontend-dev 2>/dev/null || true

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.dev.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "📊 Checking service status..."
docker-compose -f docker-compose.dev.yml ps

# Show logs
echo "📝 Showing recent logs..."
docker-compose -f docker-compose.dev.yml logs --tail=20

echo "✅ Development environment setup complete!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Database: localhost:5432"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "   Stop services: docker-compose -f docker-compose.dev.yml down"
echo "   Restart: docker-compose -f docker-compose.dev.yml restart"
