/**
 * API query parameter types
 */

import { ProjectStatus } from '@/types/enums/project-status.enum';
import { ProjectType } from '@/types/enums/project-type.enum';
import { PurchaseOrderStatus } from '@/types/enums/po-status.enum';
import { InvoiceStatus } from '@/types/enums/invoice-status.enum';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface ProjectQueryParams extends PaginationParams {
  status?: ProjectStatus;
  projectType?: ProjectType;
  search?: string;
  sortBy?: 'projectName' | 'startDate' | 'budget' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface SupplierQueryParams extends PaginationParams {
  isGSTRegistered?: boolean;
  search?: string;
  sortBy?: 'supplierName' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PurchaseOrderQueryParams extends PaginationParams {
  projectId?: number;
  supplierId?: number;
  status?: PurchaseOrderStatus;
  orderDateFrom?: string;
  orderDateTo?: string;
  sortBy?: 'orderDate' | 'totalAmount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface InvoiceQueryParams extends PaginationParams {
  status?: InvoiceStatus;
  dueDateFrom?: string;
  dueDateTo?: string;
  supplierId?: number;
  sortBy?: 'invoiceDate' | 'dueDate' | 'amount';
  sortOrder?: 'asc' | 'desc';
}
