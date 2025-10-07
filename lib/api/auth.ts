import apiClient from './client';
import type { ApiResponse } from '@/types/api.types';
import type { AuthResponse, LoginRequest, User } from '@/types/auth.types';

/**
 * Authentication API Client
 * 
 * C# equivalent: IAuthService / AuthService
 * 
 * Like:
 * public interface IAuthService
 * {
 *     Task<AuthResponse> LoginAsync(LoginRequest request);
 *     Task<bool> LogoutAsync();
 *     Task<User> GetCurrentUserAsync();
 * }
 */

export const authApi = {
  /**
   * Login
   * POST /api/v1/Auth/login
   * 
   * C# equivalent:
   * [HttpPost("login")]
   * public async Task<IActionResult> Login(LoginRequest request)
   */
  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/v1/Auth/login',
      credentials
    );
    return response.data;
  },

  /**
   * Logout
   * POST /api/v1/Auth/logout
   * 
   * C# equivalent:
   * [HttpPost("logout")]
   * public async Task<IActionResult> Logout()
   */
  logout: async () => {
    const response = await apiClient.post<ApiResponse<boolean>>(
      '/api/v1/Auth/logout'
    );
    return response.data;
  },

  /**
   * Get current user
   * GET /api/v1/Auth/me
   * 
   * C# equivalent:
   * [HttpGet("me")]
   * public async Task<IActionResult> GetCurrentUser()
   */
  getCurrentUser: async () => {
    const response = await apiClient.get<ApiResponse<User>>(
      '/api/v1/Auth/me'
    );
    return response.data;
  },
};