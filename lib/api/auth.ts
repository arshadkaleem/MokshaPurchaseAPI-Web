/**
 * Authentication API calls
 */


import apiClient from './client';
import { ApiResponse, LoginRequest, LoginResponse, UserResponse } from '@/types';

export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('🔐 Attempting login with:', credentials.email);
    
    try {
      // Backend returns data directly, NOT wrapped in ApiResponse for auth endpoints
      const response = await apiClient.post<LoginResponse>(
        '/auth/login',
        credentials
      );
      
      console.log('✅ Full Response:', response);
      console.log('✅ Response Data:', response.data);
      
      // Backend AuthController returns LoginResponse directly
      const loginData = response.data;
      console.log('🔍 Login Data:', loginData);
      if (!loginData.accessToken) {
        console.error('❌ Missing accessToken in response:', loginData);
        throw new Error('Invalid response: missing accessToken');
      }
      
      if (!loginData.user) {
        console.error('❌ Missing user in response:', loginData);
        throw new Error('Invalid response: missing user');
      }
      
      console.log('✅ AccessToken:', loginData.accessToken);
      console.log('✅ User:', loginData.user);
      
      return loginData;
    } catch (error: any) {
      console.error('❌ Login API Error:', error);
      console.error('❌ Error Response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },

  /**
   * Get current user info
   */
  getCurrentUser: async () => {
    const response = await apiClient.get<ApiResponse<UserResponse>>('/auth/me');
    return response.data.data;
  },
};