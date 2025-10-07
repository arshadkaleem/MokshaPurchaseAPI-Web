// ============================================
// PAYMENT TYPES
// ============================================

/**
 * Payment Response - What you GET from the API
 * Matches: PaymentResponse from your Swagger
 */
export interface PaymentResponse {
  paymentID: number;
  invoiceID: number;
  paymentDate: string; // ISO date string
  amount: number;
  paymentMethod: string | null;
  transactionReference: string | null;
  processedBy: string | null;
  createdAt: string;
  updatedAt: string;

  // Nested objects from API
  invoice: InvoiceSummary;
}

/**
 * Invoice Summary - Nested in Payment
 * Shows which invoice this payment is for
 */
export interface InvoiceSummary {
  invoiceID: number;
  invoiceNumber: string; // Display as "INV-001"
  purchaseOrderID: number;
  totalAmount: number;
  status: string; // "Pending" | "Paid" | "Cancelled"

  // Nested PO info
  purchaseOrder: PurchaseOrderInfo;
}

/**
 * Purchase Order Info - Nested deeper
 */
export interface PurchaseOrderInfo {
  purchaseOrderID: number;
  poNumber: string;
  projectName: string;
  supplierName: string;
}

/**
 * Create Payment Request - What you POST
 *
 * C# equivalent:
 * public class CreatePaymentRequest
 * {
 *     public int InvoiceID { get; set; }
 *     public DateTime PaymentDate { get; set; }
 *     public decimal Amount { get; set; }
 *     public string? PaymentMethod { get; set; }
 *     public string? TransactionReference { get; set; }
 * }
 */
export interface CreatePaymentRequest {
  invoiceID: number;
  paymentDate: string; // Format: "2025-10-07"
  amount: number;
  paymentMethod?: string | null; // Optional: "Cash", "Check", "Bank Transfer", etc.
  transactionReference?: string | null; // Optional: Check number, transaction ID, etc.
}

/**
 * Update Payment Request - What you PUT to /payments/{id}
 *
 * C# equivalent:
 * public class UpdatePaymentRequest
 * {
 *     public DateTime PaymentDate { get; set; }
 *     public decimal Amount { get; set; }
 *     public string? PaymentMethod { get; set; }
 *     public string? TransactionReference { get; set; }
 * }
 */
export interface UpdatePaymentRequest {
  paymentDate: string;
  amount: number;
  paymentMethod?: string | null;
  transactionReference?: string | null;
}

/**
 * Payment Method - Common payment methods
 */
export const PaymentMethods = [
  'Cash',
  'Check',
  'Bank Transfer',
  'Credit Card',
  'Debit Card',
  'Online Payment',
  'Other',
] as const;

export type PaymentMethod = (typeof PaymentMethods)[number];
