// Admin API client for Naira Vault Ledger Admin Portal

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class AdminApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('admin_token');
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
      headers['X-Admin-Token'] = this.token; // Additional admin identifier
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

  // Admin Authentication
  async adminLogin(email: string, password: string, token: string) {
    const response = await this.request<any>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, token }),
    });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout() {
    this.clearToken();
  }

  // Dashboard Stats
  async getAdminStats() {
    return this.request<any>('/admin/stats');
  }

  async getRecentUsers(limit: number = 5) {
    return this.request<any>(`/admin/users/recent?limit=${limit}`);
  }

  // User Management
  async getAllUsers(params?: { page?: number; limit?: number; search?: string; kycStatus?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.kycStatus) query.append('kycStatus', params.kycStatus);
    
    return this.request<any>(`/admin/users?${query.toString()}`);
  }

  async getUserDetails(userId: string) {
    return this.request<any>(`/admin/users/${userId}`);
  }

  async deactivateUser(userId: string) {
    return this.request<any>(`/admin/users/${userId}/deactivate`, {
      method: 'PUT',
    });
  }

  async activateUser(userId: string) {
    return this.request<any>(`/admin/users/${userId}/activate`, {
      method: 'PUT',
    });
  }

  // KYC Management
  async getPendingKYC() {
    return this.request<any>('/admin/kyc/pending');
  }

  async getKYCDetails(kycId: string) {
    return this.request<any>(`/admin/kyc/${kycId}`);
  }

  async getKYCDocuments(userId: string) {
    return this.request<any>(`/admin/kyc/${userId}/documents`);
  }

  async approveKYC(kycId: string, notes?: string) {
    return this.request<any>(`/admin/kyc/${kycId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    });
  }

  async rejectKYC(kycId: string, reason: string, notes?: string) {
    return this.request<any>(`/admin/kyc/${kycId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason, notes }),
    });
  }

  async allowKYCResubmission(userId: string) {
    return this.request<any>(`/admin/kyc/${userId}/allow-resubmission`, {
      method: 'PUT',
    });
  }

  // Analytics
  async getAnalytics(params?: { startDate?: string; endDate?: string }) {
    const query = new URLSearchParams();
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    
    return this.request<any>(`/admin/analytics?${query.toString()}`);
  }
}

// Create and export a singleton instance
export const adminApi = new AdminApiClient(API_BASE_URL);

