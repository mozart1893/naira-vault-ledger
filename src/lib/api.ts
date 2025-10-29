// API client for Naira Vault Ledger
// Replaces Supabase with direct backend API calls

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async register(userData: {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
    accountType?: 'individual' | 'business';
  }) {
    const response = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    // Don't set token yet - need to verify OTP first
    return response;
  }

  async verifyOTP(data: {
    email?: string;
    phone?: string;
    otpCode: string;
    otpType: 'email' | 'phone';
  }) {
    const response = await this.request<any>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Set token if both verifications are complete
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async resendOTP(data: {
    email?: string;
    phone?: string;
    otpType: 'email' | 'phone';
  }) {
    return this.request<any>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken: string) {
    const response = await this.request<any>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout() {
    try {
      await this.request<any>('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
  }

  // Wallets
  async getWallets() {
    return this.request<any[]>('/wallets');
  }

  async createWallet(walletData: any) {
    return this.request<any>('/wallets', {
      method: 'POST',
      body: JSON.stringify(walletData),
    });
  }

  async getWallet(id: string) {
    return this.request<any>(`/wallets/${id}`);
  }

  // Transactions
  async getTransactions(params?: { limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());
    
    return this.request<any[]>(`/transactions?${query.toString()}`);
  }

  async createTransaction(transactionData: any) {
    return this.request<any>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async getTransaction(id: string) {
    return this.request<any>(`/transactions/${id}`);
  }

  // Exchange Rates
  async getExchangeRates() {
    return this.request<any>('/exchange-rates');
  }

  async convertCurrency(from: string, to: string, amount: number) {
    return this.request<any>('/exchange-rates/convert', {
      method: 'POST',
      body: JSON.stringify({ from, to, amount }),
    });
  }

  // User Profile
  async getProfile() {
    return this.request<any>('/users/profile');
  }

  async updateProfile(profileData: any) {
    return this.request<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // KYC Verification
  async submitKYC(kycData: any) {
    return this.request<any>('/kyc/submit', {
      method: 'POST',
      body: JSON.stringify(kycData),
    });
  }

  async getKYCStatus() {
    return this.request<any>('/kyc/status');
  }

  // Audit Logs
  async getAuditLogs(params?: { limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());
    
    return this.request<any[]>(`/audit-logs?${query.toString()}`);
  }

  // System Settings
  async getSystemSettings() {
    return this.request<any>('/system/settings');
  }

  async updateSystemSettings(settings: any) {
    return this.request<any>('/system/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
}

// Create and export a singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export types for TypeScript
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  currency: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  wallet_id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface ExchangeRate {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  created_at: string;
  updated_at: string;
}
