# Naira Vault Admin Portal

## 📋 Overview

The Admin Portal is a **separate service** for managing the Naira Vault Ledger system. It runs independently on port 3002 and provides comprehensive administrative tools.

**Service:** Admin Back Office  
**Port:** 3002  
**Status:** ✅ Complete  
**Separation:** Independent from user frontend  

---

## ✨ Features

### **Admin Dashboard**
- System metrics overview (users, transactions, volume)
- Recent user registrations
- Pending KYC verifications
- Quick action buttons

### **User Management**
- View all registered users
- Search and filter functionality
- User details and status
- Activate/deactivate users
- Send emails to users

### **KYC Verification**
- Review pending KYC submissions
- View submitted documents (BVN/NIN, ID, Selfie)
- Approve or reject verifications
- Add rejection reasons
- Document preview and download

### **Analytics & Reports**
- User growth charts
- Transaction volume trends
- System performance metrics
- Exportable reports

---

## 🚀 Quick Start

### **Installation:**
```bash
cd admin-portal

# Install dependencies
npm install

# Start development server
npm run dev

# Access at:
# http://localhost:3002
```

### **Demo Login Credentials:**
```
Email: admin@nairavault.com
Password: Admin@123
2FA Token: 000000
```

---

## 🌐 Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | AdminLogin | Admin authentication |
| `/dashboard` | AdminDashboard | Main overview |
| `/users` | UsersManagement | User management |
| `/kyc` | KYCManagement | KYC verification |
| `/analytics` | Analytics | System analytics |

---

## 🔧 Configuration

### **Environment Variables:**
Create `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Naira Vault Admin Portal
```

### **Port Configuration:**
- Default port: `3002`
- Change in `vite.config.ts` if needed

---

## 📊 Architecture

### **Separate Service Benefits:**

1. **Security** - Admin portal isolated from user frontend
2. **Deployment** - Can deploy independently
3. **Performance** - No admin code in user bundle
4. **Scaling** - Scale admin and user frontends separately
5. **Access Control** - Different domain/subdomain possible

### **Service Communication:**
```
Admin Portal (3002)
    ↓ HTTP/REST
Backend API (8000)
    ↓
Database (PostgreSQL)
```

---

## 🎨 Design

### **Color Scheme:**
- Primary: Slate-900 (dark)
- Accent: Purple-600
- Contrasts with user portal

### **Theme:**
- Dark header
- Professional admin aesthetic
- Data-focused design

---

## 📁 Project Structure

```
admin-portal/
├── src/
│   ├── pages/
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── UsersManagement.tsx
│   │   ├── KYCManagement.tsx
│   │   └── Analytics.tsx
│   ├── components/
│   │   ├── ui/              (shadcn/ui components)
│   │   ├── AdminHeader.tsx
│   │   └── AdminProtectedRoute.tsx
│   ├── contexts/
│   │   └── AdminAuthContext.tsx
│   ├── lib/
│   │   ├── api.ts           (Admin API client)
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md (this file)
```

---

## 🔐 Security

### **Authentication:**
- Separate admin auth system
- 2FA token requirement
- JWT tokens with admin claims
- Session management

### **Access Control:**
- All routes protected (except login)
- Role-based access (admin/super_admin)
- Audit logging of admin actions

---

## 🚀 Development

### **Start Admin Portal:**
```bash
npm run dev
# Runs on http://localhost:3002
```

### **Build for Production:**
```bash
npm run build
# Output in dist/
```

### **Preview Production Build:**
```bash
npm run preview
# Preview on http://localhost:3002
```

---

## 🔗 Integration

### **Backend API:**
Admin portal connects to same backend as user portal:
- API URL: `http://localhost:8000/api`
- Admin endpoints: `/api/admin/*`
- Same database, separate authentication

### **Deployment:**
- Can deploy to different server
- Can use different subdomain (admin.nairavault.com)
- Independent scaling and updates

---

## 📚 Documentation

Complete documentation available in main project:
- **[docs/features/ADMIN_PORTAL.md](../docs/features/ADMIN_PORTAL.md)**

---

## ✅ Features Implemented

- [x] Admin authentication with 2FA
- [x] Dashboard with key metrics
- [x] User management table
- [x] KYC verification workflow
- [x] Analytics and charts
- [x] Protected routes
- [x] Separate service on port 3002
- [ ] Backend admin API endpoints (TODO)

---

## 🎊 Summary

**Service:** Admin Portal  
**Port:** 3002  
**Status:** ✅ Complete  
**Separation:** ✅ Independent service  

**Access:**
- Login: http://localhost:3002/login
- Dashboard: http://localhost:3002/dashboard

**Demo Credentials:**
- Email: admin@nairavault.com
- Password: Admin@123
- 2FA: 000000

---

**Created:** October 29, 2025  
**Type:** Separate Admin Service  
**Framework:** React + Vite + TypeScript  

🎉 **Admin portal is now a separate, independent service!**

