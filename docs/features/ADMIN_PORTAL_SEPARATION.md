# Admin Portal - Separate Service Documentation

## 🎯 Overview

The Admin Portal has been extracted into a **completely separate service** running independently on port 3002.

**Date:** October 29, 2025  
**Architecture:** Microservices-style separation  
**Status:** ✅ Complete  

---

## 🏗️ Architecture Change

### **Before:**
```
Single Frontend (Port 3000)
├── User Routes (/landing, /dashboard, etc.)
└── Admin Routes (/admin/dashboard, /admin/users, etc.)

Issues:
❌ Admin code in user bundle
❌ Security concerns
❌ Cannot deploy separately
❌ Same authentication system
```

### **After:**
```
User Frontend (Port 3000)          Admin Portal (Port 3002)
├── User Routes only               ├── Admin Routes only
├── User authentication            ├── Admin authentication
└── Lightweight bundle             └── Admin-focused features

Benefits:
✅ Complete separation
✅ Enhanced security
✅ Independent deployment
✅ Smaller bundles
✅ Different domains possible
```

---

## 📁 New Structure

```
naira-vault-ledger/
│
├── src/                           ← User Frontend (Port 3000)
│   ├── pages/                     ← NO admin pages
│   └── ...                        ← User features only
│
└── admin-portal/                  ← Admin Portal (Port 3002)
    ├── src/
    │   ├── pages/                 ← Admin pages
    │   │   ├── AdminLogin.tsx
    │   │   ├── AdminDashboard.tsx
    │   │   ├── UsersManagement.tsx
    │   │   ├── KYCManagement.tsx
    │   │   └── Analytics.tsx
    │   ├── components/
    │   │   ├── ui/                ← shadcn/ui components
    │   │   ├── AdminHeader.tsx
    │   │   └── AdminProtectedRoute.tsx
    │   ├── contexts/
    │   │   └── AdminAuthContext.tsx
    │   └── lib/
    │       └── api.ts             ← Admin API client
    ├── package.json               ← Separate dependencies
    ├── vite.config.ts             ← Port 3002 config
    └── README.md
```

---

## 🚀 Running Both Services

### **Complete System:**

```bash
# Terminal 1: Infrastructure
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: User Frontend
npm run dev

# Terminal 4: Admin Portal
cd admin-portal && npm run dev
```

### **Access Points:**
- **Users:** http://localhost:3000
- **Admins:** http://localhost:3002
- **API:** http://localhost:8000

---

## 🔐 Security Benefits

### **1. Code Separation:**
- ✅ Admin code not in user bundle
- ✅ Users can't access admin code
- ✅ Reduced attack surface

### **2. Different Authentication:**
- ✅ Separate admin auth system
- ✅ 2FA for admin login
- ✅ Different token storage
- ✅ Independent sessions

### **3. Network Isolation:**
- ✅ Can run on different servers
- ✅ Different firewall rules
- ✅ IP whitelist for admin portal
- ✅ VPN access possible

### **4. Deployment Flexibility:**
```
Production Example:
User Frontend:  https://app.nairavault.com
Admin Portal:   https://admin.nairavault.com (restricted access)
Backend API:    https://api.nairavault.com
```

---

## 🎯 Admin Portal Features

### **Available Now:**
- ✅ Admin authentication (separate from users)
- ✅ Dashboard with system metrics
- ✅ User management (view, search, activate/deactivate)
- ✅ KYC verification (approve/reject)
- ✅ Analytics and charts
- ✅ Dark themed UI
- ✅ Protected routes

### **Access:**
```
Login: http://localhost:3002/login
Dashboard: http://localhost:3002/dashboard
Users: http://localhost:3002/users
KYC: http://localhost:3002/kyc
Analytics: http://localhost:3002/analytics
```

---

## 📊 Service Comparison

| Aspect | User Frontend | Admin Portal |
|--------|---------------|--------------|
| **Port** | 3000 | 3002 |
| **Purpose** | Customer facing | Administrative |
| **Authentication** | User JWT | Admin JWT + 2FA |
| **Theme** | Light (Purple) | Dark (Slate) |
| **Users** | Customers | Administrators |
| **Features** | Wallets, Transactions | User Mgmt, KYC, Analytics |
| **Deployment** | Public | Restricted |
| **Scaling** | Customer load | Admin load |

---

## 🔧 Configuration

### **Admin Portal (`.env`):**
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Naira Vault Admin Portal
```

### **Port Configuration:**
File: `admin-portal/vite.config.ts`
```typescript
server: {
  port: 3002,  // Admin portal port
  host: true,
}
```

---

## 📚 Documentation

**Setup Guide:**  
[docs/ADMIN_PORTAL_SETUP.md](./docs/ADMIN_PORTAL_SETUP.md)

**Feature Documentation:**  
[docs/features/ADMIN_PORTAL.md](./docs/features/ADMIN_PORTAL.md)

**Quick Start:**  
[docs/general/START_ADMIN_PORTAL.md](./docs/general/START_ADMIN_PORTAL.md)

---

## ✅ Benefits Achieved

### **Security:**
- ✅ Admin code separated from user code
- ✅ Different authentication systems
- ✅ Can restrict admin portal access (IP whitelist)
- ✅ No admin functionality exposed to users

### **Performance:**
- ✅ Smaller user frontend bundle
- ✅ Faster user app loading
- ✅ Admin features don't slow user app

### **Development:**
- ✅ Work on admin without affecting users
- ✅ Deploy admin independently
- ✅ Different update schedules possible

### **Deployment:**
- ✅ Can deploy to different servers
- ✅ Different domains/subdomains
- ✅ Independent scaling
- ✅ Better resource allocation

---

## 🎊 Summary

**Change:** Admin portal moved to separate service  
**Location:** `/admin-portal` directory  
**Port:** 3002 (was /admin/* routes)  
**Separation:** Complete  

**User Frontend:**
- ✅ Cleaned of admin code
- ✅ Runs on port 3000
- ✅ User features only

**Admin Portal:**
- ✅ Separate service
- ✅ Runs on port 3002
- ✅ Admin features only
- ✅ Independent deployment

**Status:** 🎉 **Successfully separated!**

---

**Created:** October 29, 2025  
**Architecture:** Separated services  
**Security:** Enhanced  
**Deployment:** Flexible  

🛡️ **Admin portal is now a completely independent service on port 3002!**

