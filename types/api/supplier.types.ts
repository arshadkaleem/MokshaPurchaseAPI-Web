/**
 * Supplier-related types
 */

export interface CreateSupplierRequest {
  supplierName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  isGSTRegistered: boolean;
  gstin?: string;
  gstRegistrationDate?: string;
  gstStatus?: string;
  stateCode?: string;
  stateName?: string;
  pan?: string;
  gstType?: string;
  turnoverRange?: string;
  hsnCode?: string;
  taxRate?: number;
  isCompositionDealer?: boolean;
  isECommerce?: boolean;
  isReverseCharge?: boolean;
  gstExemptionReason?: string;
}

export interface UpdateSupplierRequest extends CreateSupplierRequest {}

export interface SupplierResponse {
  supplierId: number;
  supplierName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  isGSTRegistered: boolean;
  gstin?: string;
  gstRegistrationDate?: string;
  gstStatus?: string;
  stateCode?: string;
  stateName?: string;
  pan?: string;
  gstType?: string;
  turnoverRange?: string;
  hsnCode?: string;
  taxRate?: number;
  isCompositionDealer: boolean;
  isECommerce: boolean;
  isReverseCharge: boolean;
  gstExemptionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierListItem {
  supplierId: number;
  supplierName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  isGSTRegistered: boolean;
  gstin?: string;
}
