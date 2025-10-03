/**
 * TanStack Query hooks for Projects
 * REPLACES: Manual useState/useEffect patterns
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/lib/api/projects';
import { queryKeys } from '@/lib/query-keys';
import { toast } from '@/hooks/use-toast';
import { CreateProjectRequest, UpdateProjectRequest } from '@/types';

/**
 * Fetch paginated list of projects
 */
export function useProjects(filters?: {
  status?: string;
  projectType?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: queryKeys.projects.list(filters),
    queryFn: () =>
      projectsApi.getProjects(
        filters?.status,
        filters?.projectType,
        filters?.page || 1
      ),
    // Data transformation happens here if needed
    select: (data) => data, // Backend already returns unwrapped data
  });
}

/**
 * Fetch single project by ID
 */
export function useProject(id: number) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => projectsApi.getProjectById(id),
    enabled: !!id, // Only run if id exists
  });
}

/**
 * Create new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectsApi.createProject(data),
    onSuccess: () => {
      // Invalidate all project lists to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() });
      
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create project',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Update existing project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProjectRequest }) =>
      projectsApi.updateProject(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific project detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(variables.id),
      });
      
      // Invalidate all project lists
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() });

      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update project',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Delete project (soft delete)
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => projectsApi.deleteProject(id),
    onSuccess: () => {
      // Invalidate all project lists to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() });

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete project',
        variant: 'destructive',
      });
    },
  });
}