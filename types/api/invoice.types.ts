/**
 * Invoice-related types
 */

import { InvoiceStatus } from '@/types/enums/invoice-status.enum';

export interface CreateInvoiceRequest {
  purchaseOrderId: number;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  gstAmount?: number;
  notes?: string;
}

export interface UpdateInvoiceRequest {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  gstAmount?: number;
  notes?: string;
}

export interface InvoiceResponse {
  invoiceId: number;
  purchaseOrderId: number;
  purchaseOrderNumber?: string;
  supplierName?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  gstAmount?: number;
  notes?: string;
  processedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceListItem {
  invoiceId: number;
  invoiceNumber: string;
  supplierName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
}
