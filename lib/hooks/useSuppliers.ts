import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliersApi, type SuppliersQueryParams } from '@/lib/api/suppliers';
import type { CreateSupplierRequest, UpdateSupplierRequest } from '@/types/suppliers.types';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api/client';

/**
 * Custom Hooks for Suppliers
 * 
 * C# equivalent: ISupplierService / SupplierService
 * 
 * These hooks provide:
 * - Data fetching with automatic caching (like IMemoryCache)
 * - Loading and error states
 * - Mutations (create, update, delete)
 * - Cache invalidation (like cache.Remove())
 * 
 * Think of React Query as:
 * - Entity Framework + IMemoryCache combined
 * - Automatic background refetching
 * - Optimistic updates
 * - Request deduplication
 */

// ============================================
// QUERY KEYS
// ============================================

/**
 * Query keys for cache management
 * 
 * C# equivalent: Cache keys in Redis/IMemoryCache
 * 
 * const string SUPPLIER_LIST_KEY = "suppliers:list";
 * const string SUPPLIER_DETAIL_KEY = "suppliers:detail:{0}";
 */
export const supplierKeys = {
  all: ['suppliers'] as const,                                    // ['suppliers']
  lists: () => [...supplierKeys.all, 'list'] as const,           // ['suppliers', 'list']
  list: (filters?: SuppliersQueryParams) => 
    [...supplierKeys.lists(), filters] as const,                  // ['suppliers', 'list', {...filters}]
  details: () => [...supplierKeys.all, 'detail'] as const,       // ['suppliers', 'detail']
  detail: (id: number) => 
    [...supplierKeys.details(), id] as const,                     // ['suppliers', 'detail', 1]
};

// ============================================
// QUERIES (Read Operations)
// ============================================

/**
 * Fetch all suppliers with optional filters
 * 
 * C# equivalent:
 * public async Task<PaginatedResponse<SupplierResponse>> GetSuppliersAsync(
 *     bool? isGSTRegistered, 
 *     string? search,
 *     int page = 1,
 *     int pageSize = 20
 * )
 * {
 *     // Check cache first
 *     var cacheKey = $"suppliers:{isGSTRegistered}:{search}:{page}";
 *     if (_cache.TryGetValue(cacheKey, out var cached))
 *         return cached;
 *     
 *     // Fetch from repository
 *     var data = await _repository.GetAllAsync(filters);
 *     
 *     // Cache for 1 minute
 *     _cache.Set(cacheKey, data, TimeSpan.FromMinutes(1));
 *     
 *     return data;
 * }
 * 
 * @param filters - Optional query parameters
 * @returns { data, isLoading, error, refetch }
 */
export function useSuppliers(filters?: SuppliersQueryParams) {
  return useQuery({
    // Unique key for this query - used for caching
    // Different filters = different cache entry
    queryKey: supplierKeys.list(filters),
    
    // Function to fetch data (your repository call)
    queryFn: () => suppliersApi.getAll(filters),
    
    // Keep previous data while fetching new data (for smooth pagination)
    placeholderData: (previousData) => previousData,
    
    // Optional: How long data is considered fresh
    // staleTime: 60 * 1000, // 1 minute (defaults from QueryProvider)
  });
}

/**
 * Fetch a single supplier by ID
 * 
 * C# equivalent:
 * public async Task<SupplierResponse> GetSupplierByIdAsync(int id)
 * {
 *     var cacheKey = $"supplier:{id}";
 *     if (_cache.TryGetValue(cacheKey, out var cached))
 *         return cached;
 *     
 *     var data = await _repository.GetByIdAsync(id);
 *     _cache.Set(cacheKey, data, TimeSpan.FromMinutes(5));
 *     
 *     return data;
 * }
 * 
 * @param id - Supplier ID
 * @returns { data, isLoading, error, refetch }
 */
export function useSupplier(id: number) {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => suppliersApi.getById(id),
    
    // Only run query if id is provided and valid
    // C# equivalent: if (id > 0) { ... }
    enabled: !!id && id > 0,
  });
}

// ============================================
// MUTATIONS (Write Operations)
// ============================================

/**
 * Create a new supplier
 * 
 * C# equivalent:
 * public async Task<SupplierResponse> CreateSupplierAsync(CreateSupplierRequest request)
 * {
 *     var supplier = await _repository.CreateAsync(request);
 *     
 *     // Invalidate list cache so it refetches
 *     _cache.Remove("suppliers:list");
 *     
 *     // Show success message
 *     _toastService.Success("Supplier created successfully");
 *     
 *     return supplier;
 * }
 * 
 * Usage in component:
 * const createMutation = useCreateSupplier();
 * await createMutation.mutateAsync(formData);
 * 
 * @returns { mutate, mutateAsync, isPending, error }
 */
export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    // The mutation function (your repository call)
    mutationFn: (data: CreateSupplierRequest) => suppliersApi.create(data),
    
    // Called when mutation succeeds
    onSuccess: (response) => {
      // Invalidate suppliers list cache - forces refetch
      // C# equivalent: _cache.Remove("suppliers:list");
      queryClient.invalidateQueries({ 
        queryKey: supplierKeys.lists() 
      });

      // Show success message
      toast({
        title: 'Success',
        description: 'Supplier created successfully',
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
 * Update an existing supplier
 * 
 * C# equivalent:
 * public async Task<SupplierResponse> UpdateSupplierAsync(
 *     int id, 
 *     UpdateSupplierRequest request
 * )
 * {
 *     var supplier = await _repository.UpdateAsync(id, request);
 *     
 *     // Invalidate both detail and list caches
 *     _cache.Remove($"supplier:{id}");
 *     _cache.Remove("suppliers:list");
 *     
 *     _toastService.Success("Supplier updated successfully");
 *     
 *     return supplier;
 * }
 * 
 * Usage:
 * const updateMutation = useUpdateSupplier();
 * await updateMutation.mutateAsync({ id: 1, data: formData });
 * 
 * @returns { mutate, mutateAsync, isPending, error }
 */
export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSupplierRequest }) =>
      suppliersApi.update(id, data),
    
    onSuccess: (response, variables) => {
      // Invalidate the specific supplier detail cache
      queryClient.invalidateQueries({ 
        queryKey: supplierKeys.detail(variables.id) 
      });
      
      // Invalidate all supplier lists
      queryClient.invalidateQueries({ 
        queryKey: supplierKeys.lists() 
      });

      toast({
        title: 'Success',
        description: 'Supplier updated successfully',
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
 * Delete a supplier
 * 
 * C# equivalent:
 * public async Task DeleteSupplierAsync(int id)
 * {
 *     await _repository.DeleteAsync(id);
 *     
 *     // Remove from cache
 *     _cache.Remove($"supplier:{id}");
 *     _cache.Remove("suppliers:list");
 *     
 *     _toastService.Success("Supplier deleted successfully");
 * }
 * 
 * Usage:
 * const deleteMutation = useDeleteSupplier();
 * await deleteMutation.mutateAsync(supplierId);
 * 
 * @returns { mutate, mutateAsync, isPending, error }
 */
export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => suppliersApi.delete(id),
    
    onSuccess: (_, deletedId) => {
      // Remove the specific supplier from cache
      queryClient.removeQueries({ 
        queryKey: supplierKeys.detail(deletedId) 
      });
      
      // Invalidate all lists
      queryClient.invalidateQueries({ 
        queryKey: supplierKeys.lists() 
      });

      toast({
        title: 'Success',
        description: 'Supplier deleted successfully',
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