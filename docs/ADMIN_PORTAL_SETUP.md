# Admin Portal Setup Guide - Separate Service

## 📋 Overview

The Naira Vault Admin Portal is a **separate, independent service** that runs on port 3002, completely isolated from the user frontend (port 3000).

**Service:** Admin Portal  
**Port:** 3002  
**Location:** `/admin-portal`  
**Status:** ✅ Ready to run  

---

## 🏗️ Architecture

### **Separated Services:**

```
┌──────────────────┐        ┌──────────────────┐
│  User Frontend   │        │  Admin Portal    │
│  Port: 3000      │        │  Port: 3002      │
│  React + Vite    │        │  React + Vite    │
└────────┬─────────┘        └────────┬─────────┘
         │                           │
         └───────────┬───────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  Backend API   │
            │  Port: 8000    │
            └────────┬───────┘
                     │
                     ▼
            ┌────────────────┐
            │   PostgreSQL   │
            │   Port: 5444   │
            └────────────────┘
```

**Benefits:**
- ✅ Complete separation (security)
- ✅ Independent deployment
- ✅ Different domains possible
- ✅ Separate scaling
- ✅ No admin code in user bundle

---

## 🚀 Quick Start

### **Step 1: Navigate to Admin Portal**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/admin-portal
```

### **Step 2: Install Dependencies**
```bash
npm install

# This installs:
# - React, React Router
# - Vite build tool
# - Tailwind CSS
# - shadcn/ui components
# - React Hook Form, Zod
# - And all other dependencies
```

### **Step 3: Create Environment File**
```bash
cat > .env << 'EOF'
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Naira Vault Admin Portal
EOF
```

### **Step 4: Start Admin Portal**
```bash
npm run dev

# Expected output:
#   VITE v5.x.x  ready in XXX ms
#
#   ➜  Local:   http://localhost:3002/
#   ➜  Network: use --host to expose
```

### **Step 5: Access Admin Portal**
```bash
open http://localhost:3002

# You should see the admin login page!
```

---

## 🔐 Admin Login

### **Demo Credentials:**
```
Email: admin@nairavault.com
Password: Admin@123
2FA Token: 000000
```

### **Login Flow:**
```
1. Visit http://localhost:3002/login
2. Enter credentials above
3. Click "Admin Sign In"
4. Redirected to /dashboard
5. Access all admin features!
```

---

## 🌐 Complete System Startup

To run the **complete system** with admin portal:

### **Terminal 1: Infrastructure**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger
docker-compose -f docker-compose.dev.yml up -d postgres redis
```

### **Terminal 2: Backend API**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/backend
npm run dev
# Runs on port 8000
```

### **Terminal 3: User Frontend**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger
npm run dev
# Runs on port 3000
```

### **Terminal 4: Admin Portal**
```bash
cd /Users/waleadeniji/Codes/DOCUMENTATIONS/naira-vault-ledger/admin-portal
npm run dev
# Runs on port 3002
```

### **Access Points:**
- **User App:** http://localhost:3000
- **Admin Portal:** http://localhost:3002
- **Backend API:** http://localhost:8000

---

## 📊 Admin Portal Pages

Once logged in, you can access:

| Page | URL | Description |
|------|-----|-------------|
| **Login** | http://localhost:3002/login | Admin authentication |
| **Dashboard** | http://localhost:3002/dashboard | System overview |
| **Users** | http://localhost:3002/users | User management |
| **KYC** | http://localhost:3002/kyc | KYC verification |
| **Analytics** | http://localhost:3002/analytics | Reports & charts |

---

## 🎨 Admin Portal Features

### **Dashboard:**
- 4 metric cards (Users, Volume, Transactions, Wallets)
- Recent users list
- Pending KYC list
- Quick actions

### **User Management:**
- All users table
- Search and filter
- User details
- Activate/Deactivate
- Send emails

### **KYC Management:**
- Pending submissions
- Document viewer
- Approve/Reject workflow
- Rejection reasons
- Download documents

### **Analytics:**
- User growth chart
- Transaction volume chart
- Revenue analytics
- Export capabilities

---

## 🔧 Configuration

### **Vite Configuration (`vite.config.ts`):**
```typescript
export default defineConfig({
  server: {
    port: 3002,  // Admin portal port
    host: true,
  },
})
```

### **API Configuration (`.env`):**
```env
VITE_API_URL=http://localhost:8000/api
```

### **Change Port:**
Edit `vite.config.ts` and `package.json` scripts

---

## 🏗️ Project Structure

```
admin-portal/                 ← Separate service
├── src/
│   ├── pages/               ← Admin pages (5 pages)
│   ├── components/          ← Admin components + UI
│   ├── contexts/            ← Admin auth context
│   ├── lib/                 ← Admin API client
│   ├── App.tsx              ← Admin app root
│   └── main.tsx             ← Entry point
├── package.json             ← Separate dependencies
├── vite.config.ts           ← Port 3002 config
└── README.md                ← This file

naira-vault-ledger/           ← Main user frontend
├── src/                     ← User pages (NO admin)
├── package.json
└── ... (port 3000)
```

---

## 🔒 Security Benefits

### **Separation:**
- ✅ Admin code not in user frontend
- ✅ Admin assets not publicly accessible
- ✅ Different authentication system
- ✅ Can use different domain/subdomain

### **Production Deployment:**
```
User Frontend:  https://app.nairavault.com (port 3000)
Admin Portal:   https://admin.nairavault.com (port 3002)
Backend API:    https://api.nairavault.com (port 8000)
```

---

## 🐛 Troubleshooting

### **Port Already in Use:**
```bash
# Find process on port 3002
lsof -i :3002

# Kill process
lsof -ti:3002 | xargs kill -9

# Or change port in vite.config.ts
```

### **Cannot Connect to Backend:**
```bash
# Ensure backend is running
curl http://localhost:8000/health

# Check .env has correct API_URL
cat .env
```

### **Dependencies Issue:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Production Build

### **Build:**
```bash
npm run build

# Output in dist/
# Deploy dist/ folder to server
```

### **Preview Build:**
```bash
npm run preview
# Preview on http://localhost:3002
```

### **Deployment:**
```bash
# Deploy dist/ to:
# - Nginx/Apache server
# - Vercel/Netlify
# - AWS S3 + CloudFront
# - Any static hosting
```

---

## 📚 Documentation

Complete documentation:
- **[Admin Portal Features](../docs/features/ADMIN_PORTAL.md)**
- **[Admin Portal Setup](../docs/ADMIN_PORTAL_SETUP.md)** (this file)

---

## ✅ Checklist

### **First Time Setup:**
- [ ] Navigate to `admin-portal/` directory
- [ ] Run `npm install`
- [ ] Create `.env` file
- [ ] Run `npm run dev`
- [ ] Access http://localhost:3002
- [ ] Login with demo credentials

### **Ongoing Use:**
- [ ] Ensure backend is running (port 8000)
- [ ] Start admin portal (`npm run dev`)
- [ ] Access admin features
- [ ] Monitor system metrics

---

## 🎯 Comparison

| Aspect | User Frontend | Admin Portal |
|--------|---------------|--------------|
| **Port** | 3000 | 3002 |
| **Users** | Customers | Administrators |
| **Features** | Wallets, Transactions | User Mgmt, KYC, Analytics |
| **Theme** | Light, Purple | Dark, Slate |
| **Auth** | User JWT | Admin JWT + 2FA |
| **Deployment** | app.domain.com | admin.domain.com |

---

## 🎊 Summary

**Service:** Independent Admin Portal  
**Port:** 3002  
**Status:** ✅ Ready to use  
**Installation:** `npm install && npm run dev`  

**Access:** http://localhost:3002  
**Login:** admin@nairavault.com / Admin@123 / 000000  

**Benefits:**
- ✅ Completely separated from user frontend
- ✅ Independent deployment
- ✅ Enhanced security
- ✅ Better performance (smaller bundles)
- ✅ Professional admin experience

---

**Created:** October 29, 2025  
**Type:** Separate React Service  
**Framework:** Vite + React + TypeScript  

🎉 **Admin portal is now a completely separate service on port 3002!**

