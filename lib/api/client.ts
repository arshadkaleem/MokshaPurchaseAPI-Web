import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '@/lib/utils/token-storage';
/**
 * Base Axios client configuration
 * 
 * C# equivalent: Your HttpClient configuration in Startup.cs
 * 
 * This is like:
 * services.AddHttpClient<IApiClient, ApiClient>(client => {
 *     client.BaseAddress = new Uri(configuration["ApiBaseUrl"]);
 * });
 */

// Create the axios instance (like creating HttpClient)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds (like HttpClient.Timeout)
});

/**
 * REQUEST INTERCEPTOR
 * Runs before every request is sent
 * 
 * C# equivalent: DelegatingHandler or Middleware
 * Like adding Authorization header in every request
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from storage (we'll implement auth later)
    // For now, let's prepare for it
    const token = getAuthToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development (like ILogger in C#)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Runs after every response is received
 * 
 * C# equivalent: Exception handling middleware
 * Like your global exception handler
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    
    // Return just the data (unwrap the response)
    // So instead of response.data.data, we can just use response.data
    return response;
  },
  (error: AxiosError) => {
    // Handle errors globally
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', error.message);
    }

    // Handle specific HTTP status codes
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          console.error('Unauthorized - Please login');
          // We'll implement logout later
          // logout();
          // window.location.href = '/login';
          break;

        case 403:
          // Forbidden
          console.error('Forbidden - You do not have permission');
          break;

        case 404:
          // Not found
          console.error('Resource not found');
          break;

        case 500:
          // Server error
          console.error('Server error - Please try again later');
          break;

        default:
          console.error(`Error: ${status}`);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - Please check your connection');
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to get auth token
 * We'll implement this properly when we build authentication
 */
function getAuthToken(): string | null {
  return tokenStorage.getToken();
}

/**
 * Helper function to handle API errors
 * Extracts error message from different error formats
 * 
 * C# equivalent: Your custom exception to error message converter
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // API returned an error response
    if (error.response?.data) {
      const data = error.response.data as any;
      
      // Check for validation errors (like ModelState errors in C#)
      if (data.errors) {
        // Combine all validation errors
        const messages = Object.values(data.errors)
          .flat()
          .join(', ');
        return messages;
      }
      
      // Check for detail message
      if (data.detail) {
        return data.detail;
      }
      
      // Check for title
      if (data.title) {
        return data.title;
      }

      // Check for message
      if (data.message) {
        return data.message;
      }
    }
    
    // No response data, use error message
    return error.message || 'An error occurred';
  }
  
  // Unknown error type
  return 'An unexpected error occurred';
}




export default apiClient;