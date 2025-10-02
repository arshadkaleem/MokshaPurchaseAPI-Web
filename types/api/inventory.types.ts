/**
 * Inventory-related types
 */

import { UnitOfMeasure } from '@/types/enums/unit-of-measure.enum';

export interface ReceiveMaterialRequest {
  purchaseOrderId: number;
  materialId: number;
  quantity: number;
  location: string;
  receivedDate: string;
  notes?: string;
}

export interface InventoryResponse {
  inventoryId: number;
  materialId: number;
  materialName: string;
  unitOfMeasure: UnitOfMeasure;
  quantity: number;
  location: string;
  lastRestocked?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryListItem {
  inventoryId: number;
  materialName: string;
  quantity: number;
  location: string;
  unitOfMeasure: UnitOfMeasure;
}
