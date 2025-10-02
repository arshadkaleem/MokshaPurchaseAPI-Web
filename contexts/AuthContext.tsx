'use client';

/**
 * Authentication Context Provider
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserResponse, LoginRequest } from '@/types';
import { authApi } from '@/lib/api/auth';
import { AxiosError } from 'axios';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        console.log('🔍 Init Auth - Token:', token);
        console.log('🔍 Init Auth - User:', storedUser);

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          console.log('✅ User restored from localStorage:', parsedUser);
          setUser(parsedUser);
        } else {
          console.log('⚠️ No token or user in localStorage');
        }
      } catch (err) {
        console.error('❌ Failed to parse stored user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setError(null);
      setIsLoading(true);

      console.log('🔐 Starting login process...');
      const response = await authApi.login(credentials);

      console.log('✅ Login successful, storing data...');
      console.log('   - Token:', response.accessToken);
      console.log('   - User:', response.user);

      // Store token and user with correct field names
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Verify storage
      console.log('✅ Stored in localStorage:');
      console.log('   - token:', localStorage.getItem('token'));
      console.log('   - user:', localStorage.getItem('user'));

      setUser(response.user);

      // Redirect to dashboard
      console.log('✅ Redirecting to dashboard...');
      router.push('/dashboard');
    } catch (err) {
      const error = err as AxiosError<any>;
      console.error('❌ Login failed:', error);
      
      if (error.response?.data?.errors) {
        // Validation errors
        const validationErrors = Object.values(error.response.data.errors).flat();
        setError(validationErrors[0] as string);
      } else if (error.response?.data?.detail) {
        // API error detail
        setError(error.response.data.detail);
      } else if (error.response?.data?.message) {
        // Custom error message
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Failed to login. Please try again.');
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    authApi.logout();
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}