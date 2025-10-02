/**
 * Report-related types
 */

import { PurchaseOrderStatus } from '@/types/enums/po-status.enum';
import { InvoiceStatus } from '@/types/enums/invoice-status.enum';

export interface SpendingByProjectResponse {
  projectId: number;
  projectName: string;
  totalSpent: number;
  approvedAmount: number;
  pendingAmount: number;
  purchaseOrderCount: number;
}

export interface SpendingBySupplierResponse {
  supplierId: number;
  supplierName: string;
  totalSpent: number;
  purchaseOrderCount: number;
  invoiceCount: number;
}

export interface PurchaseOrderSummaryResponse {
  status: PurchaseOrderStatus;
  count: number;
  totalAmount: number;
}

export interface PendingApprovalsResponse {
  purchaseOrderId: number;
  projectName: string;
  supplierName: string;
  orderDate: string;
  totalAmount: number;
  daysAging: number;
}

export interface OutstandingInvoicesResponse {
  invoiceId: number;
  invoiceNumber: string;
  supplierName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  daysOverdue: number;
}

export interface InvoiceAgingResponse {
  ageRange: string;
  count: number;
  totalAmount: number;
}

export interface InvoiceSummaryResponse {
  status: InvoiceStatus;
  count: number;
  totalAmount: number;
}
