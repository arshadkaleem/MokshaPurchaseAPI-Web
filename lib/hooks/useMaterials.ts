import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialsApi, type MaterialsQueryParams } from '@/lib/api/materials';
import type { CreateMaterialRequest, UpdateMaterialRequest } from '@/types/materials.types';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api/client';

/**
 * Custom Hooks for Materials
 * 
 * C# equivalent: IMaterialService / MaterialService
 */

// ============================================
// QUERY KEYS
// ============================================

/**
 * Query keys for cache management
 * 
 * C# equivalent: Cache keys
 * const string MATERIAL_LIST_KEY = "materials:list";
 * const string MATERIAL_DETAIL_KEY = "materials:detail:{0}";
 */
export const materialKeys = {
  all: ['materials'] as const,
  lists: () => [...materialKeys.all, 'list'] as const,
  list: (filters?: MaterialsQueryParams) => 
    [...materialKeys.lists(), filters] as const,
  details: () => [...materialKeys.all, 'detail'] as const,
  detail: (id: number) => 
    [...materialKeys.details(), id] as const,
};

// ============================================
// QUERIES (Read Operations)
// ============================================

/**
 * Fetch all materials with optional filters
 * 
 * C# equivalent:
 * public async Task<PaginatedResponse<MaterialResponse>> GetMaterialsAsync(
 *     string? search,
 *     int page = 1,
 *     int pageSize = 20
 * )
 * 
 * Usage:
 * const { data, isLoading, error } = useMaterials({ search: 'cement' });
 */
export function useMaterials(filters?: MaterialsQueryParams) {
  return useQuery({
    queryKey: materialKeys.list(filters),
    queryFn: () => materialsApi.getAll(filters),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch a single material by ID
 * 
 * C# equivalent:
 * public async Task<MaterialResponse> GetMaterialByIdAsync(int id)
 * 
 * Usage:
 * const { data, isLoading } = useMaterial(materialId);
 */
export function useMaterial(id: number) {
  return useQuery({
    queryKey: materialKeys.detail(id),
    queryFn: () => materialsApi.getById(id),
    enabled: !!id && id > 0,
  });
}

// ============================================
// MUTATIONS (Write Operations)
// ============================================

/**
 * Create a new material
 * 
 * C# equivalent:
 * public async Task<MaterialResponse> CreateMaterialAsync(CreateMaterialRequest request)
 * 
 * Usage:
 * const createMutation = useCreateMaterial();
 * await createMutation.mutateAsync(formData);
 */
export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaterialRequest) => materialsApi.create(data),
    
    onSuccess: (response) => {
      queryClient.invalidateQueries({ 
        queryKey: materialKeys.lists() 
      });

      toast({
        title: 'Success',
        description: 'Material created successfully',
        variant: 'default',
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
 * Update an existing material
 * 
 * C# equivalent:
 * public async Task<MaterialResponse> UpdateMaterialAsync(
 *     int id, 
 *     UpdateMaterialRequest request
 * )
 * 
 * Usage:
 * const updateMutation = useUpdateMaterial();
 * await updateMutation.mutateAsync({ id: 1, data: formData });
 */
export function useUpdateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMaterialRequest }) =>
      materialsApi.update(id, data),
    
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: materialKeys.detail(variables.id) 
      });
      
      queryClient.invalidateQueries({ 
        queryKey: materialKeys.lists() 
      });

      toast({
        title: 'Success',
        description: 'Material updated successfully',
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
 * Delete a material
 * 
 * C# equivalent:
 * public async Task DeleteMaterialAsync(int id)
 * 
 * Usage:
 * const deleteMutation = useDeleteMaterial();
 * await deleteMutation.mutateAsync(materialId);
 */
export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => materialsApi.delete(id),
    
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ 
        queryKey: materialKeys.detail(deletedId) 
      });
      
      queryClient.invalidateQueries({ 
        queryKey: materialKeys.lists() 
      });

      toast({
        title: 'Success',
        description: 'Material deleted successfully',
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