// API Response Types based on backend endpoints

export interface StatsOverview {
  totalSpend: {
    current: number;
    previous: number;
    change: number;
  };
  invoiceCount: {
    current: number;
    previous: number;
    change: number;
  };
  documentUploads: {
    current: number;
    previous: number;
    change: number;
  };
  avgInvoiceValue: {
    current: number;
    previous: number;
    change: number;
  };
}

export interface InvoiceTrend {
  month: string;
  invoiceCount: number;
  totalSpend: number;
}

export interface VendorSpend {
  vendorId: string;
  vendorName: string;
  totalSpend: number;
  percentage: number;
  cumulativePercentage: number;
}

export interface CategorySpend {
  category: string;
  amount: number;
  percentage: number;
}

export interface CashOutflow {
  range: string;
  amount: number;
  count: number;
}

export interface Invoice {
  id: string;
  invoiceCode: string;
  vendorName: string;
  customerName?: string;
  invoiceDate: string;
  totalAmount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate?: string;
  paymentDate?: string;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  results?: any[];
  timestamp: Date;
}

export interface ChatResponse {
  question: string;
  sql: string;
  results: any[];
  success: boolean;
  error?: string;
}
