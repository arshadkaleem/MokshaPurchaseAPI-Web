/**
 * Token Storage Utilities
 * Now uses both localStorage AND cookies for better middleware support
 */

const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenStorage = {
  /**
   * Save auth token in both localStorage and cookie
   */
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      // Save in localStorage
      localStorage.setItem(TOKEN_KEY, token);
      
      // Save in cookie (for middleware)
      document.cookie = `authToken=${token}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days
    }
  },

  /**
   * Get auth token from localStorage or cookie
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      // Try localStorage first
      const localToken = localStorage.getItem(TOKEN_KEY);
      if (localToken) return localToken;
      
      // Fallback to cookie
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'authToken') return value;
      }
    }
    return null;
  },

  /**
   * Save refresh token
   */
  setRefreshToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },

  /**
   * Get refresh token
   */
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },

  /**
   * Clear all tokens from both localStorage and cookies
   */
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      
      // Clear cookies
      document.cookie = 'authToken=; path=/; max-age=0';
    }
  },
};