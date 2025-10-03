/**
 * Common API types used across all endpoints
 */

/**
 * Standard API response wrapper for single items
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  timestamp: string;
}

/**
 * Paginated API response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];              // ✅ Array of items
  pagination: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  message: string;
  timestamp: string;
}

/**
 * API error response (ProblemDetails format)
 */
export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
}
