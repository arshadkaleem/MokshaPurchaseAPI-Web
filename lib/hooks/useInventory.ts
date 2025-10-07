import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  inventoryApi,
  type InventoryQueryParams,
  type MovementQueryParams,
} from '@/lib/api/inventory';
import type {
  CreateInventoryRequest,
  UpdateInventoryRequest,
  CreateMovementRequest,
} from '@/types/inventory.types';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api/client';

/**
 * Custom Hooks for Inventory
 *
 * C# equivalent: Service layer methods wrapped in React hooks
 */

// ============================================
// QUERY KEYS
// ============================================

export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (filters?: InventoryQueryParams) =>
    [...inventoryKeys.lists(), filters] as const,
  details: () => [...inventoryKeys.all, 'detail'] as const,
  detail: (materialId: number) => [...inventoryKeys.details(), materialId] as const,
  movements: () => [...inventoryKeys.all, 'movements'] as const,
  movementList: (filters?: MovementQueryParams) =>
    [...inventoryKeys.movements(), filters] as const,
  materialMovements: (materialId: number) =>
    [...inventoryKeys.movements(), 'material', materialId] as const,
};

// ============================================
// QUERIES (Read Operations) - INVENTORY
// ============================================

/**
 * Fetch all inventory records
 */
export function useInventory(filters?: InventoryQueryParams) {
  return useQuery({
    queryKey: inventoryKeys.list(filters),
    queryFn: () => inventoryApi.getAll(filters),
  });
}

/**
 * Fetch inventory for a specific material
 */
export function useInventoryByMaterial(materialId: number) {
  return useQuery({
    queryKey: inventoryKeys.detail(materialId),
    queryFn: () => inventoryApi.getByMaterialId(materialId),
    enabled: !!materialId && materialId > 0,
  });
}

// ============================================
// QUERIES (Read Operations) - MOVEMENTS
// ============================================

/**
 * Fetch all inventory movements
 */
export function useInventoryMovements(filters?: MovementQueryParams) {
  return useQuery({
    queryKey: inventoryKeys.movementList(filters),
    queryFn: () => inventoryApi.getAllMovements(filters),
  });
}

/**
 * Fetch movements for a specific material
 */
export function useInventoryMovementsByMaterial(materialId: number) {
  return useQuery({
    queryKey: inventoryKeys.materialMovements(materialId),
    queryFn: () => inventoryApi.getMovementsByMaterial(materialId),
    enabled: !!materialId && materialId > 0,
  });
}

// ============================================
// MUTATIONS (Write Operations) - INVENTORY
// ============================================

/**
 * Create a new inventory record
 */
export function useCreateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryRequest) => inventoryApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.lists(),
      });

      toast({
        title: 'Success',
        description: 'Inventory record created successfully',
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
 * Update inventory settings (min/max, location)
 */
export function useUpdateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      materialId,
      data,
    }: {
      materialId: number;
      data: UpdateInventoryRequest;
    }) => inventoryApi.update(materialId, data),

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(variables.materialId),
      });

      queryClient.invalidateQueries({
        queryKey: inventoryKeys.lists(),
      });

      toast({
        title: 'Success',
        description: 'Inventory settings updated successfully',
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
 * Delete inventory record
 */
export function useDeleteInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (materialId: number) => inventoryApi.delete(materialId),

    onSuccess: (_, deletedMaterialId) => {
      queryClient.removeQueries({
        queryKey: inventoryKeys.detail(deletedMaterialId),
      });

      queryClient.invalidateQueries({
        queryKey: inventoryKeys.lists(),
      });

      toast({
        title: 'Success',
        description: 'Inventory record deleted successfully',
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

// ============================================
// MUTATIONS (Write Operations) - MOVEMENTS
// ============================================

/**
 * Create a stock movement
 */
export function useCreateMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMovementRequest) =>
      inventoryApi.createMovement(data),

    onSuccess: (response) => {
      // Invalidate inventory lists
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.lists(),
      });

      // Invalidate specific material inventory
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(response.data.materialID),
      });

      // Invalidate movements lists
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.movements(),
      });

      toast({
        title: 'Success',
        description: 'Stock movement recorded successfully',
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
