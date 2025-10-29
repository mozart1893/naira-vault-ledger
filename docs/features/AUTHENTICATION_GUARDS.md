# Authentication Guards & Landing Page

## Overview

This document describes the implementation of authentication guards and the landing page system for Naira Vault Ledger.

## Features Implemented

### 1. Landing Page
- **Path:** `/landing`
- **Purpose:** Marketing page for unauthenticated users
- **Features:**
  - Hero section with call-to-action
  - Features showcase
  - How it works section
  - Benefits section
  - Footer with links

### 2. Authentication Context
- **File:** `src/contexts/AuthContext.tsx`
- **Purpose:** Global authentication state management
- **Features:**
  - User state management
  - Persistent authentication (localStorage)
  - Login/logout functionality
  - Auto-redirect on auth state change

### 3. Protected Routes
- **Component:** `ProtectedRoute.tsx`
- **Purpose:** Prevent unauthorized access to protected pages
- **Behavior:**
  - Checks if user is authenticated
  - Shows loading state while checking auth
  - Redirects to `/landing` if not authenticated
  - Renders protected content if authenticated

### 4. Updated Dashboard
- **Path:** `/` and `/dashboard`
- **Protection:** Requires authentication
- **Features:**
  - Personalized greeting with user's name
  - Multi-currency wallet view
  - Transaction history
  - Currency converter

### 5. Enhanced Header
- **Features:**
  - User avatar with initials
  - Dropdown menu with:
    - User name and email
    - Profile link
    - Settings link
    - Logout button
  - Responsive navigation

## Route Structure

### Public Routes
```
/landing        - Landing page (marketing)
/register       - User registration
/login          - User login
/documentation  - Public documentation
```

### Protected Routes (Require Authentication)
```
/               - Dashboard (protected)
/dashboard      - Dashboard (protected)
/profile        - User profile (protected) [Future]
/settings       - User settings (protected) [Future]
```

## User Flow

### New User Journey
```
1. Visit app (any URL)
   ↓
2. Redirected to /landing (if not authenticated)
   ↓
3. Click "Create Account" → /register
   ↓
4. Complete registration + OTP verification
   ↓
5. Auto-logged in → Redirected to /dashboard
   ↓
6. Access protected pages
```

### Returning User Journey
```
1. Visit app
   ↓
2. Check localStorage for auth_token
   ↓
3a. Valid token → Load user data → Access /dashboard
3b. No/Invalid token → Redirect to /landing
   ↓
4. Click "Sign In" → /login
   ↓
5. Enter credentials
   ↓
6. Logged in → Redirected to /dashboard
```

## Authentication State Management

### AuthContext Structure
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}
```

### User Object
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  kycStatus: string;
  accountType: string;
}
```

## Protected Route Logic

```typescript
if (isLoading) {
  return <LoadingScreen />;
}

if (!isAuthenticated) {
  return <Navigate to="/landing" replace />;
}

return <ProtectedContent />;
```

## Implementation Details

### 1. AuthContext Initialization
```typescript
// On app mount:
1. Check for auth_token in localStorage
2. If token exists:
   - Fetch user profile from API
   - Set user in context
   - Mark as authenticated
3. If no token or fetch fails:
   - Clear token
   - Mark as unauthenticated
4. Set isLoading to false
```

### 2. Login Flow
```typescript
1. User submits login form
2. Call api.login(email, password)
3. API returns:
   {
     success: true,
     data: {
       token: "jwt-token",
       user: { id, email, firstName, lastName, ... }
     }
   }
4. Token saved to localStorage
5. User saved to AuthContext
6. Redirect to /dashboard
```

### 3. Logout Flow
```typescript
1. User clicks logout
2. Call api.logout()
3. Clear localStorage
4. Clear user from AuthContext
5. Redirect to /landing
```

### 4. Route Protection
```typescript
// In App.tsx:
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## Security Features

### 1. Token Storage
- ✅ JWT tokens stored in localStorage
- ✅ Automatically included in API requests
- ✅ Cleared on logout

### 2. Route Protection
- ✅ Automatic redirect if not authenticated
- ✅ Loading state prevents flash of protected content
- ✅ Cannot directly access protected routes

### 3. Token Validation
- ✅ Token verified on app mount
- ✅ Invalid tokens automatically cleared
- ✅ User profile fetched to validate token

## Testing

### Test Landing Page
```
1. Clear localStorage: localStorage.clear()
2. Visit http://localhost:3000
3. Should redirect to /landing
4. See marketing content
5. Click "Get Started" → /register
6. Click "Sign In" → /login
```

### Test Protected Routes
```
1. Clear localStorage
2. Try to visit http://localhost:3000/dashboard
3. Should redirect to /landing
4. Login
5. Should redirect to /dashboard
6. Dashboard should show user's name
```

### Test Logout
```
1. Login successfully
2. Click user avatar
3. Click "Log out"
4. Should redirect to /landing
5. localStorage should be cleared
6. Trying to access /dashboard should redirect to /landing
```

## API Integration

### Required API Responses

**Login Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+2348012345678",
      "kycStatus": "pending",
      "accountType": "individual"
    }
  }
}
```

**Profile Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+2348012345678",
    "kycStatus": "pending",
    "accountType": "individual"
  }
}
```

## Component Hierarchy

```
App
├── AuthProvider (Global auth state)
│   ├── BrowserRouter
│   │   ├── Routes
│   │   │   ├── /landing (Public)
│   │   │   ├── /register (Public)
│   │   │   ├── /login (Public)
│   │   │   ├── /documentation (Public)
│   │   │   ├── / (Protected)
│   │   │   │   └── ProtectedRoute
│   │   │   │       └── Dashboard
│   │   │   │           └── Header (with logout)
│   │   │   └── /dashboard (Protected)
│   │   │       └── ProtectedRoute
│   │   │           └── Dashboard
```

## Files Created/Modified

### New Files
- `src/contexts/AuthContext.tsx` - Authentication context provider
- `src/components/ProtectedRoute.tsx` - Route protection wrapper
- `src/pages/Landing.tsx` - Landing/marketing page
- `src/pages/Dashboard.tsx` - Protected dashboard page
- `docs/AUTHENTICATION_GUARDS.md` - This documentation

### Modified Files
- `src/App.tsx` - Added AuthProvider and protected routes
- `src/pages/Login.tsx` - Integrated with AuthContext
- `src/pages/Register.tsx` - Integrated with AuthContext
- `src/components/Header.tsx` - Added user menu and logout
- `src/lib/api.ts` - Fixed profile endpoint path

## Environment Variables

No additional environment variables required.

## User Experience Improvements

### Before
- Anyone could access wallet dashboard
- No proper authentication flow
- No landing page

### After
- ✅ Proper landing page for new users
- ✅ Protected dashboard requires login
- ✅ Seamless login/logout experience
- ✅ User info displayed in header
- ✅ Professional marketing page

## Future Enhancements

- [ ] Remember me functionality
- [ ] Session timeout warnings
- [ ] Multi-device login management
- [ ] Login activity tracking
- [ ] Force logout from all devices
- [ ] Profile page implementation
- [ ] Settings page implementation
- [ ] Password change functionality

## Troubleshooting

### Issue: Redirected to /landing after login
**Solution:** Check if token is being saved properly
```javascript
// In browser console:
localStorage.getItem('auth_token')
```

### Issue: Dashboard shows "Loading..." forever
**Solution:** Check if profile API is working
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/users/profile
```

### Issue: User avatar shows "U" instead of initials
**Solution:** Check if user.firstName and user.lastName are being set

## Security Considerations

1. **Token Expiration:** Tokens expire after 24 hours
2. **Automatic Logout:** Invalid tokens trigger automatic logout
3. **Route Guards:** All sensitive routes protected
4. **No Direct Access:** Cannot bypass login by URL manipulation

## Success Metrics

✅ Landing page created  
✅ Authentication context implemented  
✅ Protected routes working  
✅ Login integration complete  
✅ Register integration complete  
✅ Logout functionality working  
✅ Header updated with user menu  
✅ No linting errors  
✅ Type-safe implementation  

---

**Status:** ✅ Complete  
**Last Updated:** October 23, 2025  
**Version:** 1.0.0

