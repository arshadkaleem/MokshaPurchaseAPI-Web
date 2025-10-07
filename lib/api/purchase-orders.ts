import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  PurchaseOrderResponse,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
} from '@/types/purchase-orders.types';

/**
 * Purchase Orders API Client
 *
 * C# equivalent: IPurchaseOrderRepository / PurchaseOrderRepository
 */

/**
 * Query parameters for fetching purchase orders list
 */
export interface PurchaseOrdersQueryParams {
  projectId?: number; // Filter by project
  supplierId?: number; // Filter by supplier
  status?: string; // Filter by status
  page?: number; // Page number (default: 1)
  pageSize?: number; // Items per page (default: 20)
}

/**
 * Purchase Orders API - All PO-related API calls
 */
export const purchaseOrdersApi = {
  /**
   * Get all purchase orders with optional filters and pagination
   *
   * C# equivalent:
   * Task<PaginatedResponse<PurchaseOrderResponse>> GetAllAsync(
   *     int? projectId,
   *     int? supplierId,
   *     string? status,
   *     int page = 1,
   *     int pageSize = 20
   * )
   */
  getAll: async (params?: PurchaseOrdersQueryParams) => {
    const response = await apiClient.get<
      PaginatedResponse<PurchaseOrderResponse>
    >('/api/v1/PurchaseOrders', { params });
    return response.data;
  },

  /**
   * Get a single purchase order by ID
   *
   * C# equivalent:
   * Task<PurchaseOrderResponse> GetByIdAsync(int id)
   */
  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<PurchaseOrderResponse>>(
      `/api/v1/PurchaseOrders/${id}`
    );
    return response.data;
  },

  /**
   * Create a new purchase order with line items
   *
   * C# equivalent:
   * Task<PurchaseOrderResponse> CreateAsync(CreatePurchaseOrderRequest request)
   *
   * Important: The API will:
   * 1. Create the PO
   * 2. Create all line items
   * 3. Calculate total amount
   * 4. Return the complete PO with items
   */
  create: async (data: CreatePurchaseOrderRequest) => {
    const response = await apiClient.post<ApiResponse<PurchaseOrderResponse>>(
      '/api/v1/PurchaseOrders',
      data
    );
    return response.data;
  },

  /**
   * Update an existing purchase order
   *
   * C# equivalent:
   * Task<PurchaseOrderResponse> UpdateAsync(int id, UpdatePurchaseOrderRequest request)
   *
   * Important: The API will:
   * 1. Update PO basic info
   * 2. Compare items arrays to determine:
   *    - Items to UPDATE (has purchaseOrderItemId)
   *    - Items to CREATE (no purchaseOrderItemId)
   *    - Items to DELETE (not in new array)
   * 3. Recalculate total amount
   */
  update: async (id: number, data: UpdatePurchaseOrderRequest) => {
    const response = await apiClient.put<ApiResponse<PurchaseOrderResponse>>(
      `/api/v1/PurchaseOrders/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a purchase order
   *
   * C# equivalent:
   * Task DeleteAsync(int id)
   *
   * Note: This will cascade delete all line items
   */
  delete: async (id: number) => {
    await apiClient.delete(`/api/v1/PurchaseOrders/${id}`);
  },
};
