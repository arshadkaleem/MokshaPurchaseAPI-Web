import { z } from 'zod';

/**
 * Supplier Validation Schema
 * 
 * C# equivalent: FluentValidation rules
 * 
 * public class CreateSupplierValidator : AbstractValidator<CreateSupplierRequest>
 * {
 *     public CreateSupplierValidator()
 *     {
 *         RuleFor(x => x.SupplierName)
 *             .NotEmpty()
 *             .MaximumLength(100);
 *         
 *         When(x => x.IsGSTRegistered, () => {
 *             RuleFor(x => x.GSTIN)
 *                 .NotEmpty()
 *                 .Length(15);
 *         });
 *     }
 * }
 */

// ============================================
// REGEX PATTERNS
// ============================================

/**
 * GSTIN format: 22AAAAA0000A1Z5
 * - 2 digits (state code)
 * - 10 characters (PAN)
 * - 1 digit (entity number)
 * - 1 character (Z by default)
 * - 1 check digit
 */
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

/**
 * PAN format: AAAAA9999A
 * - 5 letters
 * - 4 numbers
 * - 1 letter
 */
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

/**
 * Email validation (basic)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================
// BASE SCHEMA
// ============================================

/**
 * Base supplier schema with all fields
 * We'll add conditional validation on top of this
 */
const baseSupplierSchema = z.object({
  // Basic Information
  supplierName: z
    .string()
    .min(1, 'Supplier name is required')
    .max(100, 'Supplier name cannot exceed 100 characters'),

  contactName: z
    .string()
    .max(50, 'Contact name cannot exceed 50 characters')
    .optional()
    .nullable(),

  email: z
    .string()
    .max(100, 'Email cannot exceed 100 characters')
    .refine(
      (val) => !val || EMAIL_REGEX.test(val),
      'Invalid email format'
    )
    .optional()
    .nullable(),

  phone: z
    .string()
    .max(20, 'Phone cannot exceed 20 characters')
    .optional()
    .nullable(),

  address: z
    .string()
    .optional()
    .nullable(),

  // GST Registration Status
  isGSTRegistered: z.boolean({
    required_error: 'GST registration status is required',
  }),

  // GST Information (all optional here, we'll add conditional validation below)
  gstin: z
    .string()
    .max(15, 'GSTIN must be 15 characters')
    .optional()
    .nullable(),

  gstRegistrationDate: z
    .string()
    .optional()
    .nullable(),

  gstStatus: z
    .string()
    .max(20, 'GST status cannot exceed 20 characters')
    .optional()
    .nullable(),

  stateCode: z
    .string()
    .max(2, 'State code must be 2 characters')
    .optional()
    .nullable(),

  stateName: z
    .string()
    .max(100, 'State name cannot exceed 100 characters')
    .optional()
    .nullable(),

  pan: z
    .string()
    .max(10, 'PAN must be 10 characters')
    .optional()
    .nullable(),

  gstType: z
    .string()
    .max(30, 'GST type cannot exceed 30 characters')
    .optional()
    .nullable(),

  turnoverRange: z
    .string()
    .max(50, 'Turnover range cannot exceed 50 characters')
    .optional()
    .nullable(),

  hsnCode: z
    .string()
    .max(10, 'HSN code cannot exceed 10 characters')
    .optional()
    .nullable(),

  taxRate: z
    .number({
      invalid_type_error: 'Tax rate must be a number',
    })
    .min(0, 'Tax rate must be between 0 and 100')
    .max(100, 'Tax rate must be between 0 and 100')
    .optional()
    .nullable(),

  // GST Flags
  isCompositionDealer: z.boolean().default(false),
  isECommerce: z.boolean().default(false),
  isReverseCharge: z.boolean().default(false),

  gstExemptionReason: z
    .string()
    .max(200, 'GST exemption reason cannot exceed 200 characters')
    .optional()
    .nullable(),
});

// ============================================
// CONDITIONAL VALIDATION
// ============================================

/**
 * Main supplier schema with conditional validation
 * 
 * C# equivalent:
 * When(x => x.IsGSTRegistered, () => {
 *     RuleFor(x => x.GSTIN).NotEmpty();
 * });
 */
export const supplierSchema = baseSupplierSchema
  .refine(
    (data) => {
      // If GST registered, GSTIN is required
      if (data.isGSTRegistered) {
        return !!data.gstin && data.gstin.trim().length > 0;
      }
      return true;
    },
    {
      message: 'GSTIN is required when supplier is GST registered',
      path: ['gstin'], // Error shows on gstin field
    }
  )
  .refine(
    (data) => {
      // If GSTIN provided, validate format
      if (data.gstin && data.gstin.trim().length > 0) {
        return GSTIN_REGEX.test(data.gstin);
      }
      return true;
    },
    {
      message: 'Invalid GSTIN format (e.g., 22AAAAA0000A1Z5)',
      path: ['gstin'],
    }
  )
  .refine(
    (data) => {
      // If PAN provided, validate format
      if (data.pan && data.pan.trim().length > 0) {
        return PAN_REGEX.test(data.pan);
      }
      return true;
    },
    {
      message: 'Invalid PAN format (e.g., ABCDE1234F)',
      path: ['pan'],
    }
  )
  .refine(
    (data) => {
      // If NOT GST registered, exemption reason should be provided (optional but recommended)
      // This is just a warning, not blocking validation
      return true; // Always pass, just for documentation
    },
    {
      message: 'Consider providing GST exemption reason',
      path: ['gstExemptionReason'],
    }
  );

/**
 * TypeScript type inferred from schema
 * This is what React Hook Form will use
 */
export type SupplierFormData = z.infer<typeof supplierSchema>;

// ============================================
// HELPER: Convert API response to form data
// ============================================

/**
 * Convert SupplierResponse (from API) to form-compatible data
 * Handles null values and date formatting
 * 
 * C# equivalent:
 * var formData = new SupplierFormData 
 * {
 *     SupplierName = supplier.SupplierName,
 *     ...
 * };
 */
export function convertSupplierToFormData(
  supplier: any
): Partial<SupplierFormData> {
  return {
    supplierName: supplier.supplierName || '',
    contactName: supplier.contactName || null,
    email: supplier.email || null,
    phone: supplier.phone || null,
    address: supplier.address || null,
    isGSTRegistered: supplier.isGSTRegistered || false,
    gstin: supplier.gstin || null,
    gstRegistrationDate: supplier.gstRegistrationDate || null,
    gstStatus: supplier.gstStatus || null,
    stateCode: supplier.stateCode || null,
    stateName: supplier.stateName || null,
    pan: supplier.pan || null,
    gstType: supplier.gstType || null,
    turnoverRange: supplier.turnoverRange || null,
    hsnCode: supplier.hsnCode || null,
    taxRate: supplier.taxRate || null,
    isCompositionDealer: supplier.isCompositionDealer || false,
    isECommerce: supplier.isECommerce || false,
    isReverseCharge: supplier.isReverseCharge || false,
    gstExemptionReason: supplier.gstExemptionReason || null,
  };
}