import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  ProjectResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '@/types/projects.types';

/**
 * Projects API Client
 * 
 * C# equivalent: IProjectRepository / ProjectRepository
 * 
 * Like:
 * public interface IProjectRepository 
 * {
 *     Task<ProjectResponse> GetByIdAsync(int id);
 *     Task<PaginatedResponse<ProjectResponse>> GetAllAsync(filters);
 *     Task<ProjectResponse> CreateAsync(CreateProjectRequest request);
 *     Task<ProjectResponse> UpdateAsync(int id, UpdateProjectRequest request);
 *     Task DeleteAsync(int id);
 * }
 */

/**
 * Query parameters for fetching projects list
 * Optional filters for the GET /api/v1/Projects endpoint
 */
export interface ProjectsQueryParams {
  status?: string;           // Filter by status (e.g., "Planned", "In Progress")
  projectType?: string;      // Filter by type ("Government" or "Private")
  page?: number;             // Page number (default: 1)
  pageSize?: number;         // Items per page (default: 20)
}

/**
 * Projects API - All project-related API calls
 * Think of this as your ProjectRepository class
 */
export const projectsApi = {
  /**
   * Get all projects with optional filters and pagination
   * 
   * C# equivalent:
   * Task<PaginatedResponse<ProjectResponse>> GetAllAsync(
   *     string? status, 
   *     string? projectType, 
   *     int page = 1, 
   *     int pageSize = 20
   * )
   * 
   * @param params - Optional query parameters
   * @returns Paginated list of projects
   */
  getAll: async (params?: ProjectsQueryParams) => {
    const response = await apiClient.get<PaginatedResponse<ProjectResponse>>(
      '/api/v1/Projects',
      { params } // Axios automatically converts this to query string
    );
    return response.data;
  },

  /**
   * Get a single project by ID
   * 
   * C# equivalent:
   * Task<ProjectResponse> GetByIdAsync(int id)
   * 
   * @param id - Project ID
   * @returns Single project
   */
  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<ProjectResponse>>(
      `/api/v1/Projects/${id}`
    );
    return response.data;
  },

  /**
   * Create a new project
   * 
   * C# equivalent:
   * Task<ProjectResponse> CreateAsync(CreateProjectRequest request)
   * 
   * @param data - Project creation data
   * @returns Created project
   */
  create: async (data: CreateProjectRequest) => {
    const response = await apiClient.post<ApiResponse<ProjectResponse>>(
      '/api/v1/Projects',
      data
    );
    return response.data;
  },

  /**
   * Update an existing project
   * 
   * C# equivalent:
   * Task<ProjectResponse> UpdateAsync(int id, UpdateProjectRequest request)
   * 
   * @param id - Project ID
   * @param data - Project update data
   * @returns Updated project
   */
  update: async (id: number, data: UpdateProjectRequest) => {
    const response = await apiClient.put<ApiResponse<ProjectResponse>>(
      `/api/v1/Projects/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a project
   * 
   * C# equivalent:
   * Task DeleteAsync(int id)
   * 
   * @param id - Project ID
   */
  delete: async (id: number) => {
    await apiClient.delete(`/api/v1/Projects/${id}`);
  },
};