import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesApi, type InvoicesQueryParams } from '@/lib/api/invoices';
import type {
  CreateInvoiceRequest,
  UpdateInvoiceStatusRequest,
} from '@/types/invoices.types';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api/client';

/**
 * Custom Hooks for Invoices
 */

// ============================================
// QUERY KEYS
// ============================================

export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters?: InvoicesQueryParams) =>
    [...invoiceKeys.lists(), filters] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: number) => [...invoiceKeys.details(), id] as const,
};

// ============================================
// QUERIES (Read Operations)
// ============================================

/**
 * Fetch all invoices with optional filters
 */
export function useInvoices(filters?: InvoicesQueryParams) {
  return useQuery({
    queryKey: invoiceKeys.list(filters),
    queryFn: () => invoicesApi.getAll(filters),
  });
}

/**
 * Fetch a single invoice by ID
 */
export function useInvoice(id: number) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => invoicesApi.getById(id),
    enabled: !!id && id > 0,
  });
}

// ============================================
// MUTATIONS (Write Operations)
// ============================================

/**
 * Create a new invoice
 */
export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceRequest) => invoicesApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invoiceKeys.lists(),
      });

      toast({
        title: 'Success',
        description: 'Invoice created successfully',
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
 * Update invoice status
 *
 * Important: This is the ONLY way to update an invoice
 */
export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateInvoiceStatusRequest;
    }) => invoicesApi.updateStatus(id, data),

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: invoiceKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: invoiceKeys.lists(),
      });

      toast({
        title: 'Success',
        description: 'Invoice status updated successfully',
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
 * Delete an invoice
 */
export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => invoicesApi.delete(id),

    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: invoiceKeys.detail(deletedId),
      });

      queryClient.invalidateQueries({
        queryKey: invoiceKeys.lists(),
      });

      toast({
        title: 'Success',
        description: 'Invoice deleted successfully',
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
