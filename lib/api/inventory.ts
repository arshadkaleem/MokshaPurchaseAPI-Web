import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';
import type {
  InventoryResponse,
  InventoryMovementResponse,
  CreateInventoryRequest,
  UpdateInventoryRequest,
  CreateMovementRequest,
} from '@/types/inventory.types';

/**
 * Inventory API Client
 *
 * C# equivalent: IInventoryRepository / InventoryRepository
 */

/**
 * Query parameters for fetching inventory list
 */
export interface InventoryQueryParams {
  materialId?: number; // Filter by material
  lowStockOnly?: boolean; // Show only low stock items
  page?: number;
  pageSize?: number;
}

/**
 * Query parameters for fetching movements
 */
export interface MovementQueryParams {
  materialId?: number; // Filter by material
  movementType?: string; // Filter by type (In, Out, Adjustment)
  startDate?: string; // Filter by date range (from)
  endDate?: string; // Filter by date range (to)
  page?: number;
  pageSize?: number;
}

/**
 * Inventory API - All inventory-related API calls
 */
export const inventoryApi = {
  // ============================================
  // INVENTORY (Stock Levels)
  // ============================================

  /**
   * Get all inventory records
   *
   * C# equivalent:
   * Task<IEnumerable<InventoryResponse>> GetAllAsync(int? materialId, bool? lowStockOnly)
   */
  getAll: async (params?: InventoryQueryParams) => {
    const response = await apiClient.get<ApiResponse<InventoryResponse[]>>(
      '/api/v1/Inventory',
      { params }
    );
    return response.data;
  },

  /**
   * Get inventory for a specific material
   *
   * C# equivalent:
   * Task<InventoryResponse> GetByMaterialIdAsync(int materialId)
   */
  getByMaterialId: async (materialId: number) => {
    const response = await apiClient.get<ApiResponse<InventoryResponse>>(
      `/api/v1/Inventory/material/${materialId}`
    );
    return response.data;
  },

  /**
   * Create inventory record for a material
   *
   * C# equivalent:
   * Task<InventoryResponse> CreateAsync(CreateInventoryRequest request)
   */
  create: async (data: CreateInventoryRequest) => {
    const response = await apiClient.post<ApiResponse<InventoryResponse>>(
      '/api/v1/Inventory',
      data
    );
    return response.data;
  },

  /**
   * Update inventory settings (min/max stock, location)
   *
   * C# equivalent:
   * Task<InventoryResponse> UpdateAsync(int materialId, UpdateInventoryRequest request)
   */
  update: async (materialId: number, data: UpdateInventoryRequest) => {
    const response = await apiClient.put<ApiResponse<InventoryResponse>>(
      `/api/v1/Inventory/material/${materialId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete inventory record
   *
   * C# equivalent:
   * Task DeleteAsync(int materialId)
   */
  delete: async (materialId: number) => {
    await apiClient.delete(`/api/v1/Inventory/material/${materialId}`);
  },

  // ============================================
  // MOVEMENTS (Stock Transactions)
  // ============================================

  /**
   * Get all inventory movements
   *
   * C# equivalent:
   * Task<IEnumerable<MovementResponse>> GetMovementsAsync(filters)
   */
  getAllMovements: async (params?: MovementQueryParams) => {
    const response = await apiClient.get<
      ApiResponse<InventoryMovementResponse[]>
    >('/api/v1/Inventory/movements', { params });
    return response.data;
  },

  /**
   * Get movements for a specific material
   *
   * C# equivalent:
   * Task<IEnumerable<MovementResponse>> GetMovementsByMaterialAsync(int materialId)
   */
  getMovementsByMaterial: async (materialId: number) => {
    const response = await apiClient.get<
      ApiResponse<InventoryMovementResponse[]>
    >(`/api/v1/Inventory/material/${materialId}/movements`);
    return response.data;
  },

  /**
   * Create a stock movement (In/Out/Adjustment)
   *
   * C# equivalent:
   * Task<MovementResponse> CreateMovementAsync(CreateMovementRequest request)
   *
   * Important:
   * - "In" movements increase stock
   * - "Out" movements decrease stock
   * - "Adjustment" can be positive or negative
   */
  createMovement: async (data: CreateMovementRequest) => {
    const response = await apiClient.post<
      ApiResponse<InventoryMovementResponse>
    >('/api/v1/Inventory/movements', data);
    return response.data;
  },
};
