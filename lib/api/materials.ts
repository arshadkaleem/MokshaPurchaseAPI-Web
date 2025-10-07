import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  MaterialResponse,
  CreateMaterialRequest,
  UpdateMaterialRequest,
} from '@/types/materials.types';

/**
 * Materials API Client
 * 
 * C# equivalent: IMaterialRepository / MaterialRepository
 */

/**
 * Query parameters for fetching materials list
 */
export interface MaterialsQueryParams {
  search?: string;    // Search by material name
  page?: number;      // Page number (default: 1)
  pageSize?: number;  // Items per page (default: 20)
}

/**
 * Materials API - All material-related API calls
 */
export const materialsApi = {
  /**
   * Get all materials with optional filters and pagination
   * 
   * C# equivalent:
   * Task<PaginatedResponse<MaterialResponse>> GetAllAsync(
   *     string? search, 
   *     int page = 1, 
   *     int pageSize = 20
   * )
   */
  getAll: async (params?: MaterialsQueryParams) => {
    const response = await apiClient.get<PaginatedResponse<MaterialResponse>>(
      '/api/v1/Materials',
      { params }
    );
    return response.data;
  },

  /**
   * Get a single material by ID
   * 
   * C# equivalent:
   * Task<MaterialResponse> GetByIdAsync(int id)
   */
  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<MaterialResponse>>(
      `/api/v1/Materials/${id}`
    );
    return response.data;
  },

  /**
   * Create a new material
   * 
   * C# equivalent:
   * Task<MaterialResponse> CreateAsync(CreateMaterialRequest request)
   */
  create: async (data: CreateMaterialRequest) => {
    const response = await apiClient.post<ApiResponse<MaterialResponse>>(
      '/api/v1/Materials',
      data
    );
    return response.data;
  },

  /**
   * Update an existing material
   * 
   * C# equivalent:
   * Task<MaterialResponse> UpdateAsync(int id, UpdateMaterialRequest request)
   */
  update: async (id: number, data: UpdateMaterialRequest) => {
    const response = await apiClient.put<ApiResponse<MaterialResponse>>(
      `/api/v1/Materials/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a material
   * 
   * C# equivalent:
   * Task DeleteAsync(int id)
   */
  delete: async (id: number) => {
    await apiClient.delete(`/api/v1/Materials/${id}`);
  },
};