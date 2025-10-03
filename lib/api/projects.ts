/**
 * Projects API calls
 */

import apiClient from './client';
import {
  ProjectResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  PaginatedResponse,
} from '@/types';

export const projectsApi = {
  /**
   * Get paginated list of projects
   */
  getProjects: async (
    status?: string,
    projectType?: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<ProjectResponse>> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (projectType) params.append('projectType', projectType);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await apiClient.get(`/projects?${params.toString()}`);
    return response.data; // Already unwrapped by interceptor
  },

  /**
   * Get single project by ID
   */
  getProjectById: async (id: number): Promise<ProjectResponse> => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data; // Already unwrapped
  },

  /**
   * Create new project
   */
  createProject: async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    const response = await apiClient.post('/projects', data);
    return response.data; // Already unwrapped
  },

  /**
   * Update existing project
   */
  updateProject: async (
    id: number,
    data: UpdateProjectRequest
  ): Promise<ProjectResponse> => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data; // Already unwrapped
  },

  /**
   * Delete project (soft delete)
   */
  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
};