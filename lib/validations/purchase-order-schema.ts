import { z } from 'zod';

/**
 * Purchase Order Validation Schemas
 *
 * C# equivalent: FluentValidation or Data Annotations
 *
 * Like:
 * public class CreatePurchaseOrderValidator : AbstractValidator<CreatePurchaseOrderRequest>
 * {
 *     public CreatePurchaseOrderValidator()
 *     {
 *         RuleFor(x => x.ProjectId).GreaterThan(0);
 *         RuleFor(x => x.Items).NotEmpty();
 *         RuleForEach(x => x.Items).SetValidator(new PurchaseOrderItemValidator());
 *     }
 * }
 */

// ============================================
// LINE ITEM SCHEMA (Child)
// ============================================

/**
 * Purchase Order Item Schema
 * Validates each line item in the items array
 */
export const purchaseOrderItemSchema = z.object({
  // For edit mode - existing items have an ID
  purchaseOrderItemId: z.number().optional(),

  materialId: z
    .number({
      required_error: 'Material is required',
      invalid_type_error: 'Material must be selected',
    })
    .min(1, 'Please select a material'),

  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .min(0.01, 'Quantity must be greater than 0')
    .max(999999, 'Quantity is too large'),

  unitPrice: z
    .number({
      required_error: 'Unit price is required',
      invalid_type_error: 'Unit price must be a number',
    })
    .min(0, 'Unit price cannot be negative')
    .max(9999999, 'Unit price is too large'),
});

/**
 * TypeScript type for line item form data
 */
export type PurchaseOrderItemFormData = z.infer<typeof purchaseOrderItemSchema>;

// ============================================
// PURCHASE ORDER SCHEMA (Parent)
// ============================================

/**
 * Purchase Order Schema
 * Validates the entire purchase order including all line items
 */
export const purchaseOrderSchema = z
  .object({
    projectId: z
      .number({
        required_error: 'Project is required',
        invalid_type_error: 'Project must be selected',
      })
      .min(1, 'Please select a project'),

    supplierId: z
      .number({
        required_error: 'Supplier is required',
        invalid_type_error: 'Supplier must be selected',
      })
      .min(1, 'Please select a supplier'),

    orderDate: z
      .string({
        required_error: 'Order date is required',
      })
      .min(1, 'Order date is required'),

    status: z.enum(
      [
        'Draft',
        'Pending',
        'Approved',
        'Shipped',
        'Received',
        'Cancelled',
        'Received',
      ],
      {
        required_error: 'Status is required',
      }
    ),

    // Array of line items - MUST have at least 1 item
    items: z
      .array(purchaseOrderItemSchema)
      .min(1, 'At least one item is required')
      .max(100, 'Maximum 100 items allowed'),
  })
  .refine(
    (data) => {
      // Custom validation: Check for duplicate materials
      const materialIds = data.items.map((item) => item.materialId);
      const uniqueMaterialIds = new Set(materialIds);
      return materialIds.length === uniqueMaterialIds.size;
    },
    {
      message:
        'Duplicate materials are not allowed. Each material can only appear once.',
      path: ['items'], // Error shows on items array
    }
  );




  
/**
 * TypeScript type for purchase order form data
 */
export type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;


// ============================================
// HELPER FUNCTIONS  👈 ADD THIS SECTION HERE
// ============================================

/**
 * Calculate line total for a single item
 */
export function calculateLineTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}


/**
 * Calculate total amount for all items
 */
export function calculateTotalAmount(items: PurchaseOrderItemFormData[]): number {
  return items.reduce((total, item) => {
    return total + calculateLineTotal(item.quantity, item.unitPrice);
  }, 0);
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}