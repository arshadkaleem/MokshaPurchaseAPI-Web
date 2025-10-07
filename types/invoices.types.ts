// ============================================
// INVOICE TYPES
// ============================================

/**
 * Invoice Response - What you GET from the API
 * Matches: InvoiceResponse from your Swagger
 */
export interface InvoiceResponse {
  invoiceID: number;
  purchaseOrderID: number;
  invoiceNumber: string;
  invoiceDate: string; // ISO date string
  totalAmount: number;
  status: string; // "Pending" | "Paid" | "Cancelled"
  processedBy: string | null;
  createdAt: string;
  updatedAt: string;

  // Nested objects from API
  purchaseOrder: PurchaseOrderSummary;
  payments: PaymentSummary[];
}

/**
 * Purchase Order Summary - Nested in Invoice
 * Shows which PO this invoice is for
 */
export interface PurchaseOrderSummary {
  purchaseOrderID: number;
  poNumber: string; // Display as "PO-00001"
  projectName: string;
  supplierName: string;
  totalAmount: number;
  status: string;
}

/**
 * Payment Summary - Payments made against this invoice
 */
export interface PaymentSummary {
  paymentID: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string | null;
  transactionReference: string | null;
}

/**
 * Create Invoice Request - What you POST
 *
 * C# equivalent:
 * public class CreateInvoiceRequest
 * {
 *     public int PurchaseOrderID { get; set; }
 *     public string InvoiceNumber { get; set; }
 *     public DateTime InvoiceDate { get; set; }
 *     public decimal TotalAmount { get; set; }
 * }
 */
export interface CreateInvoiceRequest {
  purchaseOrderID: number;
  invoiceNumber: string; // Must be unique
  invoiceDate: string; // Format: "2025-10-06"
  totalAmount: number;
}

/**
 * Update Invoice Status Request - What you PATCH to /invoices/{id}/status
 *
 * This is a separate endpoint for status updates only
 */
export interface UpdateInvoiceStatusRequest {
  status: string; // "Pending" | "Paid" | "Cancelled"
}

/**
 * Invoice Status - Valid status values
 */
export type InvoiceStatus = 'Pending' | 'Paid' | 'Cancelled';
