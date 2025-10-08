import apiClient from './client';

/**
 * Dashboard API Service
 *
 * Corresponds to /api/v1/Dashboard endpoint
 */

// TypeScript interfaces based on swagger schema
export interface PurchaseOrderStatusBreakdown {
  draft: number;
  pending: number;
  approved: number;
  shipped: number;
  received: number;
  cancelled: number;
}

export interface DashboardMetrics {
  totalPurchaseOrders: number;
  statusBreakdown: PurchaseOrderStatusBreakdown;
  totalSpending: number;
  spendingPeriod: string;
  pendingApprovalsCount: number;
  activeProjectsCount: number;
}

export interface RecentPurchaseOrderItem {
  purchaseOrderID: number;
  purchaseOrderNumber: string;
  supplierName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  projectName: string;
}

export interface ProjectSpendingItem {
  projectID: number;
  projectName: string;
  projectType: string;
  totalSpent: number;
  purchaseOrderCount: number;
}

export interface PendingApprovalItem {
  purchaseOrderID: number;
  purchaseOrderNumber: string;
  supplierName: string;
  totalAmount: number;
  createdDate: string;
}

export interface DraftPOItem {
  purchaseOrderID: number;
  purchaseOrderNumber: string;
  supplierName: string;
  totalAmount: number;
  createdDate: string;
}

export interface UnpaidInvoiceItem {
  invoiceID: number;
  invoiceNumber: string;
  supplierName: string;
  totalAmount: number;
  dueDate: string;
  daysOverdue: number;
}

export interface AttentionItems {
  pendingApprovalsCount: number;
  pendingApprovals: PendingApprovalItem[];
  draftPurchaseOrdersCount: number;
  draftPurchaseOrders: DraftPOItem[];
  unpaidInvoicesCount: number;
  unpaidInvoices: UnpaidInvoiceItem[];
}

export interface DashboardResponse {
  metrics: DashboardMetrics;
  recentPurchaseOrders: RecentPurchaseOrderItem[];
  topProjectsBySpending: ProjectSpendingItem[];
  attentionItems: AttentionItems;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  timestamp: string;
}

/**
 * Fetch dashboard data
 * @param period - Filter dashboard data by time period (month or year)
 * @returns Dashboard data
 */
export async function getDashboardData(period: 'month' | 'year' = 'month') {
  const response = await apiClient.get<DashboardResponse>(
    '/api/v1/Dashboard',
    {
      params: { period }
    }
  );
  return response.data;
}
