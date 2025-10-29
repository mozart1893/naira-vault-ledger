import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, adminData: AdminUser) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSessionTimeout = () => {
    toast.error('Admin session expired. Please login again.');
    setAdmin(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    localStorage.removeItem('admin_login_time');
    window.location.href = '/login';
  };

  // Check for existing admin token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      const adminData = localStorage.getItem('admin_data');
      const loginTime = localStorage.getItem('admin_login_time');
      
      if (token && adminData && loginTime) {
        const elapsed = Date.now() - parseInt(loginTime);
        
        // Check if session has expired (1 hour)
        if (elapsed >= SESSION_TIMEOUT) {
          handleSessionTimeout();
          setIsLoading(false);
          return;
        }
        
        try {
          // Restore admin data from localStorage
          setAdmin(JSON.parse(adminData));
          
          // Set timeout for remaining time
          const remaining = SESSION_TIMEOUT - elapsed;
          setTimeout(handleSessionTimeout, remaining);
          
          // Show warning 5 minutes before expiry
          if (remaining > 5 * 60 * 1000) {
            setTimeout(() => {
              toast.warning('Admin session will expire in 5 minutes.');
            }, remaining - (5 * 60 * 1000));
          }
        } catch (error) {
          console.error('Failed to restore admin session:', error);
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_data');
          localStorage.removeItem('admin_login_time');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, adminData: AdminUser) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_data', JSON.stringify(adminData));
    localStorage.setItem('admin_login_time', Date.now().toString());
    setAdmin(adminData);
    
    // Start session timeout (1 hour)
    setTimeout(handleSessionTimeout, SESSION_TIMEOUT);
    
    // Show warning 5 minutes before expiry
    setTimeout(() => {
      toast.warning('Admin session will expire in 5 minutes.');
    }, SESSION_TIMEOUT - (5 * 60 * 1000));
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    localStorage.removeItem('admin_login_time');
    setAdmin(null);
  };

  const value = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

