import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi, type ProjectsQueryParams } from '@/lib/api/projects';
import type { CreateProjectRequest, UpdateProjectRequest } from '@/types/projects.types';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api/client';

/**
 * Custom Hooks for Projects
 * 
 * C# equivalent: IProjectService / ProjectService
 * 
 * These hooks provide:
 * - Data fetching with automatic caching
 * - Loading and error states
 * - Mutations (create, update, delete)
 * - Cache invalidation
 */

// ============================================
// QUERY KEYS
// ============================================

/**
 * Query keys for cache management
 * Like cache keys in Redis
 */
export const projectKeys = {
  all: ['projects'] as const,                                    // ['projects']
  lists: () => [...projectKeys.all, 'list'] as const,           // ['projects', 'list']
  list: (filters?: ProjectsQueryParams) => 
    [...projectKeys.lists(), filters] as const,                  // ['projects', 'list', {...filters}]
  details: () => [...projectKeys.all, 'detail'] as const,       // ['projects', 'detail']
  detail: (id: number) => 
    [...projectKeys.details(), id] as const,                     // ['projects', 'detail', 1]
};

// ============================================
// QUERIES (Read Operations)
// ============================================

/**
 * Fetch all projects with optional filters
 * 
 * C# equivalent:
 * public async Task<PaginatedResponse<ProjectResponse>> GetProjectsAsync(filters)
 * 
 * @param filters - Optional query parameters
 * @returns { data, isLoading, error, refetch }
 */
export function useProjects(filters?: ProjectsQueryParams) {
  return useQuery({
    // Unique key for this query - used for caching
    queryKey: projectKeys.list(filters),
    
    // Function to fetch data
    queryFn: () => projectsApi.getAll(filters),
    
    // Keep previous data while fetching new data (for pagination)
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch a single project by ID
 * 
 * C# equivalent:
 * public async Task<ProjectResponse> GetProjectByIdAsync(int id)
 * 
 * @param id - Project ID
 * @returns { data, isLoading, error, refetch }
 */
export function useProject(id: number) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsApi.getById(id),
    
    // Only run query if id is provided and valid
    enabled: !!id && id > 0,
  });
}

// ============================================
// MUTATIONS (Write Operations)
// ============================================

/**
 * Create a new project
 * 
 * C# equivalent:
 * public async Task<ProjectResponse> CreateProjectAsync(CreateProjectRequest request)
 * 
 * @returns { mutate, mutateAsync, isLoading, error }
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    // The mutation function
    mutationFn: (data: CreateProjectRequest) => projectsApi.create(data),
    
    // Called when mutation succeeds
    onSuccess: (response) => {
      // Invalidate projects list cache - forces refetch
      // Like clearing cache in Redis after insert
      queryClient.invalidateQueries({ 
        queryKey: projectKeys.lists() 
      });

      // Show success message
      toast({
        title: 'Success',
        description: 'Project created successfully',
        variant: 'default',
      });
    },
    
    // Called when mutation fails
    onError: (error) => {
      const message = getErrorMessage(error);
      
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Update an existing project
 * 
 * C# equivalent:
 * public async Task<ProjectResponse> UpdateProjectAsync(int id, UpdateProjectRequest request)
 * 
 * @returns { mutate, mutateAsync, isLoading, error }
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProjectRequest }) =>
      projectsApi.update(id, data),
    
    onSuccess: (response, variables) => {
      // Invalidate the specific project detail cache
      queryClient.invalidateQueries({ 
        queryKey: projectKeys.detail(variables.id) 
      });
      
      // Invalidate all project lists
      queryClient.invalidateQueries({ 
        queryKey: projectKeys.lists() 
      });

      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
    },
    
    onError: (error) => {
      const message = getErrorMessage(error);
      
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Delete a project
 * 
 * C# equivalent:
 * public async Task DeleteProjectAsync(int id)
 * 
 * @returns { mutate, mutateAsync, isLoading, error }
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => projectsApi.delete(id),
    
    onSuccess: (_, deletedId) => {
      // Remove the specific project from cache
      queryClient.removeQueries({ 
        queryKey: projectKeys.detail(deletedId) 
      });
      
      // Invalidate all lists
      queryClient.invalidateQueries({ 
        queryKey: projectKeys.lists() 
      });

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
    },
    
    onError: (error) => {
      const message = getErrorMessage(error);
      
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
}