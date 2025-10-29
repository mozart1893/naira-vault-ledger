import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { startSessionTimer, clearSessionTimer, resetSessionTimer } from '@/lib/sessionTimeout';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  kycStatus: string;
  accountType: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSessionTimeout = () => {
    toast.error('Your session has expired. Please login again.');
    setUser(null);
    localStorage.removeItem('auth_token');
    clearSessionTimer();
    window.location.href = '/landing';
  };

  const handleSessionWarning = () => {
    toast.warning('Your session will expire in 5 minutes. Please save your work.');
  };

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const loginTime = localStorage.getItem('login_time');
      
      if (token && loginTime) {
        const elapsed = Date.now() - parseInt(loginTime);
        const oneHour = 60 * 60 * 1000;
        
        // Check if session has expired
        if (elapsed >= oneHour) {
          // Session expired
          handleSessionTimeout();
          setIsLoading(false);
          return;
        }
        
        try {
          // Fetch user profile to validate token
          const response = await api.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
            // Start session timer with remaining time
            const remaining = oneHour - elapsed;
            setTimeout(() => {
              startSessionTimer(handleSessionTimeout, handleSessionWarning);
            }, 0);
          } else {
            // Invalid token, clear it
            localStorage.removeItem('auth_token');
            localStorage.removeItem('login_time');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('login_time');
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Cleanup on unmount
    return () => {
      clearSessionTimer();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    if (response.success && response.data?.user) {
      setUser(response.data.user);
      // Store login time for session tracking
      localStorage.setItem('login_time', Date.now().toString());
      // Start session timeout timer (1 hour)
      startSessionTimer(handleSessionTimeout, handleSessionWarning);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    localStorage.removeItem('login_time');
    clearSessionTimer();
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

