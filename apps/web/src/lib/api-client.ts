import type {
  StatsOverview,
  InvoiceTrend,
  VendorSpend,
  CategorySpend,
  CashOutflow,
  InvoiceListResponse,
  ChatResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const VANNA_API_URL = process.env.NEXT_PUBLIC_VANNA_API_URL || 'http://localhost:8000';

class ApiClient {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Dashboard Stats
  async getStats(): Promise<StatsOverview> {
    return this.fetch<StatsOverview>('/api/stats');
  }

  // Invoice Trends
  async getInvoiceTrends(): Promise<InvoiceTrend[]> {
    return this.fetch<InvoiceTrend[]>('/api/trends/invoice-volume');
  }

  // Top Vendors
  async getTopVendors(limit: number = 10): Promise<VendorSpend[]> {
    return this.fetch<VendorSpend[]>(`/api/vendors/top10`);
  }

  // Category Spend
  async getCategorySpend(): Promise<CategorySpend[]> {
    return this.fetch<CategorySpend[]>('/api/trends/category-spend');
  }

  // Cash Outflow Forecast
  async getCashOutflow(): Promise<CashOutflow[]> {
    return this.fetch<CashOutflow[]>('/api/trends/cash-outflow');
  }

  // Invoices List
  async getInvoices(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<InvoiceListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.pageSize) query.set('pageSize', params.pageSize.toString());
    if (params?.search) query.set('search', params.search);
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    if (params?.sortOrder) query.set('sortOrder', params.sortOrder);

    const queryString = query.toString();
    const endpoint = `/api/invoices${queryString ? `?${queryString}` : ''}`;

    return this.fetch<InvoiceListResponse>(endpoint);
  }

  // Chat with Data
  async chatWithData(question: string): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/api/chat-with-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`Chat API Error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
