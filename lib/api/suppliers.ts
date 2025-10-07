import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  SupplierResponse,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from '@/types/suppliers.types';

/**
 * Suppliers API Client
 * 
 * C# equivalent: ISupplierRepository / SupplierRepository
 * 
 * public interface ISupplierRepository 
 * {
 *     Task<SupplierResponse> GetByIdAsync(int id);
 *     Task<PaginatedResponse<SupplierResponse>> GetAllAsync(filters);
 *     Task<SupplierResponse> CreateAsync(CreateSupplierRequest request);
 *     Task<SupplierResponse> UpdateAsync(int id, UpdateSupplierRequest request);
 *     Task DeleteAsync(int id);
 * }
 */

/**
 * Query parameters for fetching suppliers list
 * Optional filters for the GET /api/v1/Suppliers endpoint
 */
export interface SuppliersQueryParams {
  isGSTRegistered?: boolean;  // Filter by GST registration status
  search?: string;            // Search by name, email, or GSTIN
  page?: number;              // Page number (default: 1)
  pageSize?: number;          // Items per page (default: 20)
}

/**
 * Suppliers API - All supplier-related API calls
 * Think of this as your SupplierRepository class
 */
export const suppliersApi = {
  /**
   * Get all suppliers with optional filters and pagination
   * 
   * C# equivalent:
   * Task<PaginatedResponse<SupplierResponse>> GetAllAsync(
   *     bool? isGSTRegistered, 
   *     string? search, 
   *     int page = 1, 
   *     int pageSize = 20
   * )
   * 
   * @param params - Optional query parameters
   * @returns Paginated list of suppliers
   */
  getAll: async (params?: SuppliersQueryParams) => {
    const response = await apiClient.get<PaginatedResponse<SupplierResponse>>(
      '/api/v1/Suppliers',
      { params } // Axios automatically converts to query string
    );
    return response.data;
  },

  /**
   * Get a single supplier by ID
   * 
   * C# equivalent:
   * Task<SupplierResponse> GetByIdAsync(int id)
   * 
   * @param id - Supplier ID
   * @returns Single supplier
   */
  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<SupplierResponse>>(
      `/api/v1/Suppliers/${id}`
    );
    return response.data;
  },

  /**
   * Create a new supplier
   * 
   * C# equivalent:
   * Task<SupplierResponse> CreateAsync(CreateSupplierRequest request)
   * 
   * @param data - Supplier creation data
   * @returns Created supplier
   */
  create: async (data: CreateSupplierRequest) => {
    const response = await apiClient.post<ApiResponse<SupplierResponse>>(
      '/api/v1/Suppliers',
      data
    );
    return response.data;
  },

  /**
   * Update an existing supplier
   * 
   * C# equivalent:
   * Task<SupplierResponse> UpdateAsync(int id, UpdateSupplierRequest request)
   * 
   * @param id - Supplier ID
   * @param data - Supplier update data
   * @returns Updated supplier
   */
  update: async (id: number, data: UpdateSupplierRequest) => {
    const response = await apiClient.put<ApiResponse<SupplierResponse>>(
      `/api/v1/Suppliers/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a supplier
   * 
   * C# equivalent:
   * Task DeleteAsync(int id)
   * 
   * @param id - Supplier ID
   */
  delete: async (id: number) => {
    await apiClient.delete(`/api/v1/Suppliers/${id}`);
  },
};