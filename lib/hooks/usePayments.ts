import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, type PaymentsQueryParams } from '@/lib/api/payments';
import type {
  CreatePaymentRequest,
  UpdatePaymentRequest,
} from '@/types/payments.types';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api/client';

/**
 * Custom Hooks for Payments
 *
 * C# equivalent: Service layer methods wrapped in React hooks
 */

// ============================================
// QUERY KEYS
// ============================================

export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (filters?: PaymentsQueryParams) =>
    [...paymentKeys.lists(), filters] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: number) => [...paymentKeys.details(), id] as const,
};

// ============================================
// QUERIES (Read Operations)
// ============================================

/**
 * Fetch all payments with optional filters
 *
 * C# equivalent:
 * var payments = await _paymentService.GetAllAsync(invoiceId, paymentMethod);
 */
export function usePayments(filters?: PaymentsQueryParams) {
  return useQuery({
    queryKey: paymentKeys.list(filters),
    queryFn: () => paymentsApi.getAll(filters),
  });
}

/**
 * Fetch a single payment by ID
 *
 * C# equivalent:
 * var payment = await _paymentService.GetByIdAsync(id);
 */
export function usePayment(id: number) {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentsApi.getById(id),
    enabled: !!id && id > 0,
  });
}

// ============================================
// MUTATIONS (Write Operations)
// ============================================

/**
 * Create a new payment
 *
 * C# equivalent:
 * var payment = await _paymentService.CreateAsync(request);
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentsApi.create(data),

    onSuccess: () => {
      // Invalidate payments list
      queryClient.invalidateQueries({
        queryKey: paymentKeys.lists(),
      });

      // Also invalidate invoices list since payment affects invoice status
      queryClient.invalidateQueries({
        queryKey: ['invoices'],
      });

      toast({
        title: 'Success',
        description: 'Payment created successfully',
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
 * Update an existing payment
 *
 * C# equivalent:
 * var payment = await _paymentService.UpdateAsync(id, request);
 */
export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdatePaymentRequest;
    }) => paymentsApi.update(id, data),

    onSuccess: (response, variables) => {
      // Invalidate the specific payment detail
      queryClient.invalidateQueries({
        queryKey: paymentKeys.detail(variables.id),
      });

      // Invalidate payments list
      queryClient.invalidateQueries({
        queryKey: paymentKeys.lists(),
      });

      // Also invalidate invoices list since payment affects invoice status
      queryClient.invalidateQueries({
        queryKey: ['invoices'],
      });

      toast({
        title: 'Success',
        description: 'Payment updated successfully',
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
 * Delete a payment
 *
 * C# equivalent:
 * await _paymentService.DeleteAsync(id);
 */
export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => paymentsApi.delete(id),

    onSuccess: (_, deletedId) => {
      // Remove the specific payment from cache
      queryClient.removeQueries({
        queryKey: paymentKeys.detail(deletedId),
      });

      // Invalidate payments list
      queryClient.invalidateQueries({
        queryKey: paymentKeys.lists(),
      });

      // Also invalidate invoices list since payment affects invoice status
      queryClient.invalidateQueries({
        queryKey: ['invoices'],
      });

      toast({
        title: 'Success',
        description: 'Payment deleted successfully',
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
