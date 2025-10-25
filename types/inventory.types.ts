// ============================================
// INVENTORY TYPES
// ============================================

/**
 * Inventory Response - What you GET from the API
 * Represents current stock level for a material
 */
export interface InventoryResponse {
  inventoryID: number;
  materialID: number;
  currentStock: number; // Current quantity in stock
  minimumStock: number; // Reorder level
  maximumStock: number | null; // Optional max stock level
  unitOfMeasure: string; // "kg", "liter", "piece", etc.
  lastUpdated: string; // ISO date string
  warehouseLocation: string | null; // Optional location

  // Nested material info
  material: MaterialSummary;
}

/**
 * Material Summary - Nested in Inventory
 */
export interface MaterialSummary {
  materialID: number;
  materialName: string;
  materialCode: string;
  unitOfMeasure: string;
  unitPrice: number;
  hsnCode?: string | null;
}

/**
 * Inventory Movement Response - What you GET from the API
 * Represents a stock movement transaction
 */
export interface InventoryMovementResponse {
  movementID: number;
  materialID: number;
  movementType: string; // "In" | "Out" | "Adjustment"
  quantity: number;
  movementDate: string; // ISO date string
  referenceType: string | null; // "PurchaseOrder" | "Manual" | etc.
  referenceID: number | null; // ID of related PO, etc.
  notes: string | null;
  performedBy: string | null;
  createdAt: string;

  // Nested info
  material: MaterialSummary;
  balanceAfter: number; // Stock balance after this movement
}

/**
 * Create Inventory Request - What you POST to initialize stock
 *
 * C# equivalent:
 * public class CreateInventoryRequest
 * {
 *     public int MaterialID { get; set; }
 *     public decimal CurrentStock { get; set; }
 *     public decimal MinimumStock { get; set; }
 *     public decimal? MaximumStock { get; set; }
 *     public string? WarehouseLocation { get; set; }
 * }
 */
export interface CreateInventoryRequest {
  materialID: number;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number | null;
  warehouseLocation?: string | null;
}

/**
 * Update Inventory Request - What you PUT to update stock levels
 */
export interface UpdateInventoryRequest {
  minimumStock: number;
  maximumStock?: number | null;
  warehouseLocation?: string | null;
}

/**
 * Create Movement Request - What you POST to record stock movement
 *
 * C# equivalent:
 * public class CreateMovementRequest
 * {
 *     public int MaterialID { get; set; }
 *     public string MovementType { get; set; } // "In" | "Out" | "Adjustment"
 *     public decimal Quantity { get; set; }
 *     public DateTime MovementDate { get; set; }
 *     public string? Notes { get; set; }
 * }
 */
export interface CreateMovementRequest {
  materialID: number;
  movementType: 'In' | 'Out' | 'Adjustment';
  quantity: number;
  movementDate: string; // Format: "2025-10-07"
  notes?: string | null;
}

/**
 * Movement Type - Valid movement types
 */
export const MovementTypes = ['In', 'Out', 'Adjustment'] as const;
export type MovementType = (typeof MovementTypes)[number];

/**
 * Stock Status - For UI display
 */
export type StockStatus = 'Low' | 'Normal' | 'Overstocked' | 'Out of Stock';

/**
 * Helper to calculate stock status
 */
export function getStockStatus(
  current: number,
  minimum: number,
  maximum: number | null
): StockStatus {
  if (current <= 0) return 'Out of Stock';
  if (current < minimum) return 'Low';
  if (maximum && current > maximum) return 'Overstocked';
  return 'Normal';
}
