'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { tokenStorage } from '@/lib/utils/token-storage';
import type { User, LoginRequest } from '@/types/auth.types';

/**
 * Auth Context
 * 
 * C# equivalent: 
 * - ClaimsPrincipal (User)
 * - HttpContext.User
 * - IAuthenticationService
 * 
 * Provides:
 * - Current user info
 * - Login/Logout functions
 * - Authentication state
 */

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * Wraps the app to provide auth state
 * 
 * C# equivalent: Authentication middleware in Program.cs
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /**
   * Check if user is authenticated on mount
   * C# equivalent: Reading User from HttpContext
   */
  const checkAuth = async () => {
    try {
      const token = tokenStorage.getToken();
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Verify token by fetching current user
      const response = await authApi.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      // Token invalid or expired
      console.error('Auth check failed:', error);
      tokenStorage.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login function
   * 
   * C# equivalent:
   * await HttpContext.SignInAsync(
   *     CookieAuthenticationDefaults.AuthenticationScheme,
   *     principal
   * );
   */
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);
      
      // Save tokens
      tokenStorage.setToken(response.data.accessToken);
      tokenStorage.setRefreshToken(response.data.refreshToken);
      
      // Set user
      setUser(response.data.user);
      
      // Redirect to dashboard
      router.push('/dashboard/projects');
    } catch (error) {
      // Error is already handled by API client (shows toast)
      throw error;
    }
  };

  /**
   * Logout function
   * 
   * C# equivalent:
   * await HttpContext.SignOutAsync(
   *     CookieAuthenticationDefaults.AuthenticationScheme
   * );
   */
  const logout = async () => {
    try {
      // Call API logout endpoint
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless
      tokenStorage.clearTokens();
      setUser(null);
      router.push('/login');
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 * 
 * C# equivalent: Accessing User from controller
 * 
 * var user = HttpContext.User;
 * var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}