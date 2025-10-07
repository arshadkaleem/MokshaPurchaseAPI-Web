import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  InvoiceResponse,
  CreateInvoiceRequest,
  UpdateInvoiceStatusRequest,
} from '@/types/invoices.types';

/**
 * Invoices API Client
 *
 * C# equivalent: IInvoiceRepository / InvoiceRepository
 */

/**
 * Query parameters for fetching invoices list
 */
export interface InvoicesQueryParams {
  purchaseOrderId?: number; // Filter by PO
  status?: string; // Filter by status
  page?: number;
  pageSize?: number;
}

/**
 * Invoices API - All invoice-related API calls
 */
export const invoicesApi = {
  /**
   * Get all invoices with optional filters
   *
   * C# equivalent:
   * Task<IEnumerable<InvoiceResponse>> GetAllAsync(int? purchaseOrderId, string? status)
   *
   * Note: Your API returns IEnumerable, not paginated
   */
  getAll: async (params?: InvoicesQueryParams) => {
    const response = await apiClient.get<ApiResponse<InvoiceResponse[]>>(
      '/api/v1/Invoices',
      { params }
    );
    return response.data;
  },

  /**
   * Get a single invoice by ID
   *
   * C# equivalent:
   * Task<InvoiceResponse> GetByIdAsync(int id)
   */
  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<InvoiceResponse>>(
      `/api/v1/Invoices/${id}`
    );
    return response.data;
  },

  /**
   * Create a new invoice
   *
   * C# equivalent:
   * Task<InvoiceResponse> CreateAsync(CreateInvoiceRequest request)
   *
   * Important:
   * - Invoice number must be unique
   * - PO must exist and be Approved/Received
   * - Total amount typically matches PO total
   */
  create: async (data: CreateInvoiceRequest) => {
    const response = await apiClient.post<ApiResponse<InvoiceResponse>>(
      '/api/v1/Invoices',
      data
    );
    return response.data;
  },

  /**
   * Update invoice status
   *
   * C# equivalent:
   * Task<InvoiceResponse> UpdateStatusAsync(int id, UpdateInvoiceStatusRequest request)
   *
   * Note: This is the ONLY way to update an invoice
   * You cannot update other fields like invoice number, date, or amount
   */
  updateStatus: async (id: number, data: UpdateInvoiceStatusRequest) => {
    const response = await apiClient.patch<ApiResponse<InvoiceResponse>>(
      `/api/v1/Invoices/${id}/status`,
      data
    );
    return response.data;
  },

  /**
   * Delete an invoice
   *
   * C# equivalent:
   * Task DeleteAsync(int id)
   */
  delete: async (id: number) => {
    await apiClient.delete(`/api/v1/Invoices/${id}`);
  },
};
