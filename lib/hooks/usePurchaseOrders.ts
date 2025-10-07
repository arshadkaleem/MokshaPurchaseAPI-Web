import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';



import {
  purchaseOrdersApi,
  type PurchaseOrdersQueryParams,
} from '@/lib/api/purchase-orders';
import type {
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
} from '@/types/purchase-orders.types';

import { getErrorMessage } from '@/lib/api/client';

/**
 * Custom Hooks for Purchase Orders
 *
 * C# equivalent: IPurchaseOrderService / PurchaseOrderService
 */

// ============================================
// QUERY KEYS
// ============================================

/**
 * Query keys for cache management
 * Organized hierarchy for efficient invalidation
 */
export const purchaseOrderKeys = {
  all: ['purchase-orders'] as const,
  lists: () => [...purchaseOrderKeys.all, 'list'] as const,
  list: (filters?: PurchaseOrdersQueryParams) =>
    [...purchaseOrderKeys.lists(), filters] as const,
  details: () => [...purchaseOrderKeys.all, 'detail'] as const,
  detail: (id: number) => [...purchaseOrderKeys.details(), id] as const,
};

// ============================================
// QUERIES (Read Operations)
// ============================================

/**
 * Fetch all purchase orders with optional filters
 *
 * C# equivalent:
 * public async Task<PaginatedResponse<PurchaseOrderResponse>> GetPurchaseOrdersAsync(filters)
 *
 * @param filters - Optional query parameters
 * @returns { data, isLoading, error, refetch }
 */
export function usePurchaseOrders(filters?: PurchaseOrdersQueryParams) {
  return useQuery({
    queryKey: purchaseOrderKeys.list(filters),
    queryFn: () => purchaseOrdersApi.getAll(filters),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch a single purchase order by ID
 *
 * C# equivalent:
 * public async Task<PurchaseOrderResponse> GetPurchaseOrderByIdAsync(int id)
 *
 * Important: This returns the PO with ALL line items nested inside
 *
 * @param id - Purchase order ID
 * @returns { data, isLoading, error, refetch }
 */
export function usePurchaseOrder(id: number) {
  return useQuery({
    queryKey: purchaseOrderKeys.detail(id),
    queryFn: () => purchaseOrdersApi.getById(id),
    enabled: !!id && id > 0,
  });
}

// ============================================
// MUTATIONS (Write Operations)
// ============================================

/**
 * Create a new purchase order with line items
 *
 * C# equivalent:
 * public async Task<PurchaseOrderResponse> CreatePurchaseOrderAsync(CreatePurchaseOrderRequest request)
 *
 * Usage in component:
 * const createMutation = useCreatePurchaseOrder();
 * await createMutation.mutateAsync({
 *   projectId: 1,
 *   supplierId: 2,
 *   orderDate: "2025-10-06",
 *   status: "Completed",
 *   items: [
 *     { materialId: 1, quantity: 10, unitPrice: 100 },
 *     { materialId: 2, quantity: 5, unitPrice: 200 }
 *   ]
 * });
 *
 * @returns { mutate, mutateAsync, isLoading, error }
 */
export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseOrderRequest) =>
      purchaseOrdersApi.create(data),

    onSuccess: (response) => {
      // Invalidate all PO lists to refetch with new data
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.lists(),
      });

      toast({
        title: 'Success',
        description: 'Purchase order created successfully',
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
 * Update an existing purchase order
 *
 * C# equivalent:
 * public async Task<PurchaseOrderResponse> UpdatePurchaseOrderAsync(int id, UpdatePurchaseOrderRequest request)
 *
 * Important: Send the ENTIRE items array
 * - Items with purchaseOrderItemId → UPDATE
 * - Items without purchaseOrderItemId → CREATE
 * - Items missing from array → DELETE
 *
 * Usage in component:
 * const updateMutation = useUpdatePurchaseOrder();
 * await updateMutation.mutateAsync({
 *   id: 1,
 *   data: {
 *     projectId: 1,
 *     supplierId: 2,
 *     orderDate: "2025-10-06",
 *     status: "Completed",
 *     items: [
 *       { purchaseOrderItemId: 100, materialId: 1, quantity: 15, unitPrice: 100 }, // UPDATE
 *       { materialId: 3, quantity: 20, unitPrice: 150 }  // CREATE (no ID)
 *       // Item 101 missing → DELETE
 *     ]
 *   }
 * });
 *
 * @returns { mutate, mutateAsync, isLoading, error }
 */
export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdatePurchaseOrderRequest;
    }) => purchaseOrdersApi.update(id, data),

    onSuccess: (response, variables) => {
      // Invalidate the specific PO detail
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.detail(variables.id),
      });

      // Invalidate all PO lists
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.lists(),
      });

      toast({
        title: 'Success',
        description: 'Purchase order updated successfully',
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
 * Delete a purchase order
 *
 * C# equivalent:
 * public async Task DeletePurchaseOrderAsync(int id)
 *
 * Note: This cascades delete all line items in the database
 *
 * @returns { mutate, mutateAsync, isLoading, error }
 */
export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => purchaseOrdersApi.delete(id),

    onSuccess: (_, deletedId) => {
      // Remove the specific PO from cache
      queryClient.removeQueries({
        queryKey: purchaseOrderKeys.detail(deletedId),
      });

      // Invalidate all lists
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.lists(),
      });

      toast({
        title: 'Success',
        description: 'Purchase order deleted successfully',
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
