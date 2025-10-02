/**
 * Purchase Order-related types
 */

import { PurchaseOrderStatus } from '@/types/enums/po-status.enum';
import { UnitOfMeasure } from '@/types/enums/unit-of-measure.enum';

export interface CreatePurchaseOrderRequest {
  projectId: number;
  supplierId: number;
  orderDate: string;
  status: PurchaseOrderStatus;
  items: CreatePurchaseOrderItemRequest[];
}

export interface CreatePurchaseOrderItemRequest {
  materialId: number;
  quantity: number;
  unitPrice: number;
}

export interface UpdatePurchaseOrderRequest {
  projectId: number;
  supplierId: number;
  orderDate: string;
  status: PurchaseOrderStatus;
  items: UpdatePurchaseOrderItemRequest[];
}

export interface UpdatePurchaseOrderItemRequest {
  purchaseOrderItemId?: number;
  materialId: number;
  quantity: number;
  unitPrice: number;
}

export interface ApprovePurchaseOrderRequest {
  comments?: string;
}

export interface PurchaseOrderResponse {
  purchaseOrderId: number;
  projectId: number;
  projectName: string;
  supplierId: number;
  supplierName: string;
  createdBy: string;
  orderDate: string;
  status: PurchaseOrderStatus;
  totalAmount: number;
  items: PurchaseOrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItemResponse {
  purchaseOrderItemId: number;
  materialId: number;
  materialName: string;
  unitOfMeasure: UnitOfMeasure;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PurchaseOrderListItem {
  purchaseOrderId: number;
  projectName: string;
  supplierName: string;
  orderDate: string;
  status: PurchaseOrderStatus;
  totalAmount: number;
  createdBy: string;
}
