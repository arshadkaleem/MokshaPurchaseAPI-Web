import { z } from 'zod';

/**
 * Inventory Validation Schema
 *
 * C# equivalent: FluentValidation or Data Annotations
 */

/**
 * Create Inventory Schema
 */
export const createInventorySchema = z.object({
  materialID: z
    .number({
      required_error: 'Material is required',
      invalid_type_error: 'Material must be selected',
    })
    .min(1, 'Please select a material'),

  currentStock: z
    .number({
      required_error: 'Current stock is required',
      invalid_type_error: 'Current stock must be a number',
    })
    .min(0, 'Current stock cannot be negative'),

  minimumStock: z
    .number({
      required_error: 'Minimum stock is required',
      invalid_type_error: 'Minimum stock must be a number',
    })
    .min(0, 'Minimum stock cannot be negative'),

  maximumStock: z
    .number({
      invalid_type_error: 'Maximum stock must be a number',
    })
    .min(0, 'Maximum stock cannot be negative')
    .optional()
    .nullable(),

  warehouseLocation: z
    .string()
    .max(100, 'Warehouse location cannot exceed 100 characters')
    .optional()
    .nullable(),
});

/**
 * Update Inventory Schema
 */
export const updateInventorySchema = z.object({
  minimumStock: z
    .number({
      required_error: 'Minimum stock is required',
      invalid_type_error: 'Minimum stock must be a number',
    })
    .min(0, 'Minimum stock cannot be negative'),

  maximumStock: z
    .number({
      invalid_type_error: 'Maximum stock must be a number',
    })
    .min(0, 'Maximum stock cannot be negative')
    .optional()
    .nullable(),

  warehouseLocation: z
    .string()
    .max(100, 'Warehouse location cannot exceed 100 characters')
    .optional()
    .nullable(),
});

/**
 * Create Movement Schema
 */
export const createMovementSchema = z.object({
  materialID: z
    .number({
      required_error: 'Material is required',
      invalid_type_error: 'Material must be selected',
    })
    .min(1, 'Please select a material'),

  movementType: z.enum(['In', 'Out', 'Adjustment'], {
    required_error: 'Movement type is required',
  }),

  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .refine((val) => val !== 0, {
      message: 'Quantity cannot be zero',
    }),

  movementDate: z
    .string({
      required_error: 'Movement date is required',
    })
    .min(1, 'Movement date is required')
    .refine(
      (date) => {
        // Movement date cannot be in the future
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return selectedDate <= today;
      },
      {
        message: 'Movement date cannot be in the future',
      }
    ),

  notes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
    .nullable(),
});

/**
 * TypeScript types inferred from schemas
 */
export type CreateInventoryFormData = z.infer<typeof createInventorySchema>;
export type UpdateInventoryFormData = z.infer<typeof updateInventorySchema>;
export type CreateMovementFormData = z.infer<typeof createMovementSchema>;

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
 * Format quantity with unit
 */
export function formatQuantity(quantity: number | undefined, unit: string | undefined): string {
  if (quantity === undefined || quantity === null) {
    return `0 ${unit || ''}`;
  }
  if (!unit) {
    return quantity.toLocaleString('en-IN');
  }
  return `${quantity.toLocaleString('en-IN')} ${unit}`;
}

/**
 * Calculate stock value
 */
export function calculateStockValue(
  quantity: number,
  unitPrice: number
): number {
  return quantity * unitPrice;
}
