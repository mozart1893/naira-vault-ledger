# Naira Vault Ledger System - Troubleshooting Guide

## Common Docker Build Issues

### ARM64 Architecture Issues (Apple Silicon Macs)

#### Problem
```
Error: Cannot find module @rollup/rollup-linux-arm64-musl
```

#### Solutions

**Option 1: Use Development Docker Compose**
```bash
# Use development setup instead of production build
docker-compose -f docker-compose.dev.yml up -d
```

**Option 2: Fix Production Build**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild with no cache
docker-compose build --no-cache

# Or use alternative Dockerfile
docker-compose build --build-arg DOCKERFILE=Dockerfile.alternative
```

**Option 3: Platform-Specific Build**
```bash
# Build for specific platform
docker build --platform linux/amd64 -t naira-vault-frontend .
```

### Node.js Module Issues

#### Problem
```
npm has a bug related to optional dependencies
```

#### Solutions

**Clear npm cache and reinstall:**
```bash
# In Dockerfile or locally
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --no-optional
```

**Use specific Node.js version:**
```dockerfile
FROM node:18-alpine
# Instead of node:latest
```

### Build Performance Issues

#### Problem
Slow Docker builds or timeouts

#### Solutions

**Use .dockerignore:**
```dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.nyc_output
.coverage
```

**Optimize Dockerfile:**
```dockerfile
# Copy package files first for better caching
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy source code after dependencies
COPY . .
```

## Development Environment Issues

### Port Conflicts

#### Problem
```
Error: Port 3000 is already in use
```

#### Solutions

**Check what's using the port:**
```bash
# macOS/Linux
lsof -i :3000
lsof -i :8000

# Windows
netstat -ano | findstr :3000
```

**Kill the process:**
```bash
# macOS/Linux
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

**Use different ports:**
```bash
# Update docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Database Connection Issues

#### Problem
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

#### Solutions

**Check database status:**
```bash
docker-compose ps postgres
docker-compose logs postgres
```

**Restart database:**
```bash
docker-compose restart postgres
```

**Verify connection string:**
```env
DATABASE_URL=postgresql://naira_vault:naira_vault_password@postgres:5432/naira_vault_db
```

### Redis Connection Issues

#### Problem
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

#### Solutions

**Check Redis status:**
```bash
docker-compose ps redis
docker-compose logs redis
```

**Test Redis connection:**
```bash
docker-compose exec redis redis-cli ping
```

## Environment-Specific Issues

### macOS (Apple Silicon)

#### Common Issues
- ARM64 architecture compatibility
- Docker Desktop resource limits
- Port conflicts with system services

#### Solutions
```bash
# Use development setup
docker-compose -f docker-compose.dev.yml up -d

# Or build for specific platform
docker build --platform linux/amd64 .
```

### Windows

#### Common Issues
- Path length limitations
- Docker Desktop WSL2 issues
- PowerShell execution policies

#### Solutions
```bash
# Use WSL2 backend in Docker Desktop
# Enable "Use the WSL 2 based engine"

# Use Git Bash instead of PowerShell
# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Linux

#### Common Issues
- Permission issues with Docker
- Systemd conflicts
- Firewall blocking ports

#### Solutions
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Check firewall
sudo ufw status
sudo ufw allow 3000
sudo ufw allow 8000
```

## Performance Issues

### Slow Build Times

#### Solutions

**Use multi-stage builds efficiently:**
```dockerfile
# Copy package files first
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy source code after
COPY . .
```

**Use .dockerignore:**
```dockerignore
node_modules
.git
*.log
coverage
.nyc_output
```

**Use build cache:**
```bash
docker-compose build --build-arg BUILDKIT_INLINE_CACHE=1
```

### Memory Issues

#### Problem
```
Error: JavaScript heap out of memory
```

#### Solutions

**Increase Node.js memory:**
```bash
# In package.json scripts
"build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
```

**Or in Dockerfile:**
```dockerfile
ENV NODE_OPTIONS="--max-old-space-size=4096"
```

## Network Issues

### Container Communication

#### Problem
Services can't communicate with each other

#### Solutions

**Check network configuration:**
```bash
docker network ls
docker network inspect naira-vault-network
```

**Verify service names:**
```yaml
# In docker-compose.yml, use service names for internal communication
DATABASE_URL=postgresql://naira_vault:naira_vault_password@postgres:5432/naira_vault_db
```

### External API Issues

#### Problem
Can't connect to external services

#### Solutions

**Check network connectivity:**
```bash
docker-compose exec frontend ping google.com
docker-compose exec backend curl -I https://api.example.com
```

**Use host networking if needed:**
```yaml
services:
  frontend:
    network_mode: "host"
```

## Logging and Debugging

### Enable Debug Logging

#### Frontend
```bash
# Set debug environment
export DEBUG=vite:*
npm run dev
```

#### Backend
```bash
# Set log level
export LOG_LEVEL=debug
npm run dev
```

### View Container Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f backend
```

### Debug Container Issues

```bash
# Enter container shell
docker-compose exec frontend sh
docker-compose exec backend sh

# Check container status
docker-compose ps

# Inspect container
docker inspect <container_name>
```

## Cleanup and Reset

### Complete Reset

```bash
# Stop all services
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Clean Docker system
docker system prune -a

# Rebuild everything
docker-compose up --build
```

### Partial Reset

```bash
# Reset specific service
docker-compose down frontend
docker-compose up --build frontend

# Reset database only
docker-compose down postgres
docker-compose up -d postgres
```

## Getting Help

### Debug Information

When reporting issues, include:

```bash
# System information
docker --version
docker-compose --version
node --version
npm --version

# Container status
docker-compose ps
docker-compose logs

# System resources
docker system df
docker system info
```

### Common Solutions Checklist

- [ ] Cleared Docker cache (`docker system prune -a`)
- [ ] Rebuilt containers (`docker-compose build --no-cache`)
- [ ] Checked port conflicts (`lsof -i :3000`)
- [ ] Verified environment variables
- [ ] Checked container logs (`docker-compose logs`)
- [ ] Restarted Docker Desktop
- [ ] Used development setup (`docker-compose -f docker-compose.dev.yml`)

### Support Channels

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check `/docs/` directory
- **Slack**: #nairavault-support
- **Email**: support@nairavault.com

---

This troubleshooting guide covers the most common issues encountered when setting up and running the Naira Vault Ledger System. If you encounter issues not covered here, please check the logs and system information before seeking additional help.
