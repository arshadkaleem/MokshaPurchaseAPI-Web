import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';
import type {
  PaymentResponse,
  CreatePaymentRequest,
  UpdatePaymentRequest,
} from '@/types/payments.types';

/**
 * Payments API Client
 *
 * C# equivalent: IPaymentRepository / PaymentRepository
 */

/**
 * Query parameters for fetching payments list
 */
export interface PaymentsQueryParams {
  invoiceId?: number; // Filter by invoice
  paymentMethod?: string; // Filter by payment method
  startDate?: string; // Filter by date range (from)
  endDate?: string; // Filter by date range (to)
  page?: number;
  pageSize?: number;
}

/**
 * Payments API - All payment-related API calls
 */
export const paymentsApi = {
  /**
   * Get all payments with optional filters
   *
   * C# equivalent:
   * Task<IEnumerable<PaymentResponse>> GetAllAsync(int? invoiceId, string? paymentMethod)
   *
   * Note: Your API returns IEnumerable, not paginated
   */
  getAll: async (params?: PaymentsQueryParams) => {
    const response = await apiClient.get<ApiResponse<PaymentResponse[]>>(
      '/api/v1/Payments',
      { params }
    );
    return response.data;
  },

  /**
   * Get a single payment by ID
   *
   * C# equivalent:
   * Task<PaymentResponse> GetByIdAsync(int id)
   */
  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<PaymentResponse>>(
      `/api/v1/Payments/${id}`
    );
    return response.data;
  },

  /**
   * Create a new payment
   *
   * C# equivalent:
   * Task<PaymentResponse> CreateAsync(CreatePaymentRequest request)
   *
   * Important:
   * - Invoice must exist and not be cancelled
   * - Payment amount can be partial or full
   * - Multiple payments can be made against one invoice
   * - Payment date cannot be in the future
   */
  create: async (data: CreatePaymentRequest) => {
    const response = await apiClient.post<ApiResponse<PaymentResponse>>(
      '/api/v1/Payments',
      data
    );
    return response.data;
  },

  /**
   * Update an existing payment
   *
   * C# equivalent:
   * Task<PaymentResponse> UpdateAsync(int id, UpdatePaymentRequest request)
   *
   * Note: Can update payment date, amount, method, and reference
   */
  update: async (id: number, data: UpdatePaymentRequest) => {
    const response = await apiClient.put<ApiResponse<PaymentResponse>>(
      `/api/v1/Payments/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a payment
   *
   * C# equivalent:
   * Task DeleteAsync(int id)
   */
  delete: async (id: number) => {
    await apiClient.delete(`/api/v1/Payments/${id}`);
  },
};
