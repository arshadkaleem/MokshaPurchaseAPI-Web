// ============================================
// SUPPLIER TYPES
// C# equivalent: Your Supplier DTOs
// ============================================

/**
 * Supplier Response - What you GET from API
 * Matches: SupplierResponse from Swagger
 * 
 * C# equivalent:
 * public class SupplierResponse
 * {
 *     public int SupplierId { get; set; }
 *     public string SupplierName { get; set; }
 *     ...
 * }
 */
export interface SupplierResponse {
  // Basic Information
  supplierId: number;
  supplierName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;

  // GST Registration
  isGSTRegistered: boolean;
  gstin: string | null;
  gstRegistrationDate: string | null;  // ISO date string
  gstStatus: string | null;
  stateCode: string | null;
  stateName: string | null;
  pan: string | null;
  gstType: string | null;
  turnoverRange: string | null;
  hsnCode: string | null;
  taxRate: number | null;

  // GST Flags
  isCompositionDealer: boolean;
  isECommerce: boolean;
  isReverseCharge: boolean;
  gstExemptionReason: string | null;

  // System Fields (read-only)
  lastGSTVerificationDate: string | null;
  gstVerificationStatus: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Supplier Request - What you POST
 * Matches: CreateSupplierRequest from Swagger
 * 
 * C# equivalent:
 * public class CreateSupplierRequest
 * {
 *     [Required]
 *     [MaxLength(100)]
 *     public string SupplierName { get; set; }
 *     ...
 * }
 */
export interface CreateSupplierRequest {
  // Basic Information
  supplierName: string;                    // Required, max 100
  contactName?: string | null;             // Optional, max 50
  email?: string | null;                   // Optional, email format, max 100
  phone?: string | null;                   // Optional, max 20
  address?: string | null;                 // Optional

  // GST Registration
  isGSTRegistered: boolean;                // Required
  gstin?: string | null;                   // Required if isGSTRegistered = true, max 15
  gstRegistrationDate?: string | null;     // Optional, date format
  gstStatus?: string | null;               // Optional, max 20
  stateCode?: string | null;               // Optional, max 2
  stateName?: string | null;               // Optional, max 100
  pan?: string | null;                     // Optional, max 10
  gstType?: string | null;                 // Optional, max 30
  turnoverRange?: string | null;           // Optional, max 50
  hsnCode?: string | null;                 // Optional, max 10
  taxRate?: number | null;                 // Optional, 0-100

  // GST Flags
  isCompositionDealer: boolean;            // Default: false
  isECommerce: boolean;                    // Default: false
  isReverseCharge: boolean;                // Default: false
  gstExemptionReason?: string | null;      // Optional, max 200
}

/**
 * Update Supplier Request - What you PUT
 * Matches: UpdateSupplierRequest from Swagger
 * Same structure as CreateSupplierRequest
 */
export interface UpdateSupplierRequest extends CreateSupplierRequest {}

/**
 * Type guard to check if supplier is GST registered
 * Useful helper function
 */
export function isGSTRegisteredSupplier(
  supplier: SupplierResponse | CreateSupplierRequest | UpdateSupplierRequest
): boolean {
  return supplier.isGSTRegistered === true;
}