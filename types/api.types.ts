/**
 * Standard API response wrapper for single items
 * Think of this like your ApiResponse<T> class in C#
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  timestamp: string; // ISO 8601 format (e.g., "2024-10-05T10:30:00Z")
}

/**
 * Pagination metadata
 * Like your PaginationMetadata class in C#
 */
export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated API response wrapper
 * For endpoints that return lists with pagination
 */
export interface PaginatedResponse<T> {
  data: T[];              // Array of items
  pagination: PaginationMetadata;
  message: string;
  timestamp: string;
}

/**
 * API error response (from ProblemDetails)
 * When something goes wrong, API returns this
 */
export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail?: string;        // Optional error details
  traceId?: string;       // Optional trace ID for debugging
  errors?: Record<string, string[]>; // Validation errors
}