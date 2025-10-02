/**
 * Payment-related types
 */

export interface CreatePaymentRequest {
  invoiceId: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  transactionReference?: string;
  notes?: string;
}

export interface PaymentResponse {
  paymentId: number;
  invoiceId: number;
  invoiceNumber: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  transactionReference?: string;
  notes?: string;
  processedBy: string;
  createdAt: string;
}

export interface PaymentListItem {
  paymentId: number;
  invoiceNumber: string;
  supplierName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
}
