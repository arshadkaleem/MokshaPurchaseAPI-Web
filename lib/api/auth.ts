/**
 * Authentication API calls
 */

import apiClient from './client';
import { ApiResponse, LoginRequest, LoginResponse } from '@/types';

export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  /**
   * Logout user (client-side only for MVP)
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current user info
   */
  getCurrentUser: async () => {
    const response =
      await apiClient.get<ApiResponse<LoginResponse['user']>>('/auth/me');
    return response.data.data;
  },
};
