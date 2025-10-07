// ============================================
// PURCHASE ORDER TYPES
// ============================================

/**
 * Purchase Order Response - What you GET from the API
 * Parent entity
 */
export interface PurchaseOrderResponse {
  purchaseOrderId: number;
  projectId: number;
  projectName: string; // Populated from Project
  supplierId: number;
  supplierName: string; // Populated from Supplier
  createdBy: string;
  orderDate: string; // ISO date string
  status: string;
  totalAmount: number; // Auto-calculated
  items: PurchaseOrderItemResponse[]; // Child items
  createdAt: string;
  updatedAt: string;
}

/**
 * Purchase Order Item Response - Line items in the order
 * Child entity
 */
export interface PurchaseOrderItemResponse {
  purchaseOrderItemId: number;
  materialId: number;
  materialName: string; // Populated from Material
  unitOfMeasure: string; // Populated from Material
  quantity: number;
  unitPrice: number;
  lineTotal: number; // quantity × unitPrice
}

/**
 * Create Purchase Order Request - What you POST
 */
export interface CreatePurchaseOrderRequest {
  projectId: number;
  supplierId: number;
  orderDate: string; // Format: "2025-10-06"
  status: string; // Default: "Completed"
  items: CreatePurchaseOrderItemRequest[];
}

/**
 * Create Purchase Order Item Request - Line items for creation
 */
export interface CreatePurchaseOrderItemRequest {
  materialId: number;
  quantity: number;
  unitPrice: number;
}

/**
 * Update Purchase Order Request - What you PUT
 */
export interface UpdatePurchaseOrderRequest {
  projectId: number;
  supplierId: number;
  orderDate: string;
  status: string;
  items: UpdatePurchaseOrderItemRequest[];
}

/**
 * Update Purchase Order Item Request
 * Note: includes optional purchaseOrderItemId for existing items
 */
export interface UpdatePurchaseOrderItemRequest {
  purchaseOrderItemId?: number; // If present, update existing item; if missing, create new
  materialId: number;
  quantity: number;
  unitPrice: number;
}

/**
 * Purchase Order Status - Valid status values
 */
export type PurchaseOrderStatus =
  | 'Draft'
  | 'Pending'
  | 'Approved'
  | 'Shipped'
  | 'Received'
  | 'Cancelled'
  | 'Received'; // Your default
