import { z } from 'zod';

/**
 * Invoice Validation Schema
 *
 * C# equivalent: FluentValidation or Data Annotations
 */

/**
 * Create Invoice Schema
 */
export const createInvoiceSchema = z.object({
  purchaseOrderID: z
    .number({
      required_error: 'Purchase order is required',
      invalid_type_error: 'Purchase order must be selected',
    })
    .min(1, 'Please select a purchase order'),

  invoiceNumber: z
    .string({
      required_error: 'Invoice number is required',
    })
    .min(1, 'Invoice number is required')
    .max(50, 'Invoice number cannot exceed 50 characters')
    .regex(
      /^[A-Za-z0-9-_]+$/,
      'Invoice number can only contain letters, numbers, hyphens, and underscores'
    ),

  invoiceDate: z
    .string({
      required_error: 'Invoice date is required',
    })
    .min(1, 'Invoice date is required')
    .refine(
      (date) => {
        // Invoice date cannot be in the future
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate <= today;
      },
      {
        message: 'Invoice date cannot be in the future',
      }
    ),

  totalAmount: z
    .number({
      required_error: 'Total amount is required',
      invalid_type_error: 'Total amount must be a number',
    })
    .min(0.01, 'Total amount must be greater than 0')
    .max(999999999, 'Total amount is too large'),
});

/**
 * Update Invoice Status Schema
 */
export const updateInvoiceStatusSchema = z.object({
  status: z.enum(['Pending', 'Paid', 'Cancelled'], {
    required_error: 'Status is required',
  }),
});

/**
 * TypeScript types inferred from schemas
 */
export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceStatusFormData = z.infer<
  typeof updateInvoiceStatusSchema
>;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate outstanding amount for an invoice
 * Outstanding = Total - Sum of Payments
 */
export function calculateOutstandingAmount(
  totalAmount: number,
  payments: { amount: number }[]
): number {
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  return Math.max(0, totalAmount - totalPaid);
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
