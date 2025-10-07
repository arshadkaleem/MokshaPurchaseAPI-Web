import { z } from 'zod';

/**
 * Payment Validation Schema
 *
 * C# equivalent: FluentValidation or Data Annotations
 */

/**
 * Create Payment Schema
 */
export const createPaymentSchema = z.object({
  invoiceID: z
    .number({
      required_error: 'Invoice is required',
      invalid_type_error: 'Invoice must be selected',
    })
    .min(1, 'Please select an invoice'),

  paymentDate: z
    .string({
      required_error: 'Payment date is required',
    })
    .min(1, 'Payment date is required')
    .refine(
      (date) => {
        // Payment date cannot be in the future
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        return selectedDate <= today;
      },
      {
        message: 'Payment date cannot be in the future',
      }
    ),

  amount: z
    .number({
      required_error: 'Payment amount is required',
      invalid_type_error: 'Payment amount must be a number',
    })
    .min(0.01, 'Payment amount must be greater than 0')
    .max(999999999, 'Payment amount is too large'),

  paymentMethod: z
    .string()
    .max(50, 'Payment method cannot exceed 50 characters')
    .optional()
    .nullable(),

  transactionReference: z
    .string()
    .max(100, 'Transaction reference cannot exceed 100 characters')
    .optional()
    .nullable(),
});

/**
 * Update Payment Schema
 */
export const updatePaymentSchema = z.object({
  paymentDate: z
    .string({
      required_error: 'Payment date is required',
    })
    .min(1, 'Payment date is required')
    .refine(
      (date) => {
        // Payment date cannot be in the future
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        return selectedDate <= today;
      },
      {
        message: 'Payment date cannot be in the future',
      }
    ),

  amount: z
    .number({
      required_error: 'Payment amount is required',
      invalid_type_error: 'Payment amount must be a number',
    })
    .min(0.01, 'Payment amount must be greater than 0')
    .max(999999999, 'Payment amount is too large'),

  paymentMethod: z
    .string()
    .max(50, 'Payment method cannot exceed 50 characters')
    .optional()
    .nullable(),

  transactionReference: z
    .string()
    .max(100, 'Transaction reference cannot exceed 100 characters')
    .optional()
    .nullable(),
});

/**
 * TypeScript types inferred from schemas
 */
export type CreatePaymentFormData = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentFormData = z.infer<typeof updatePaymentSchema>;

// ============================================
// HELPER FUNCTIONS
// ============================================

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

/**
 * Calculate total payments for an invoice
 */
export function calculateTotalPaid(
  payments: { amount: number }[]
): number {
  return payments.reduce((sum, payment) => sum + payment.amount, 0);
}

/**
 * Calculate outstanding amount
 */
export function calculateOutstanding(
  totalAmount: number,
  totalPaid: number
): number {
  return Math.max(0, totalAmount - totalPaid);
}
