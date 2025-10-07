/**
 * Authentication Types
 * 
 * C# equivalent: Authentication DTOs and User models
 */

/**
 * User information
 * Matches: UserResponse from your Swagger
 */
export interface User {
  userId: string;
  email: string;
  userName: string;
  role: string;
}

/**
 * Login credentials
 * Matches: LoginRequest from your Swagger
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Auth response from API
 * Matches: AuthResponse from your Swagger
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

/**
 * Register request
 * Matches: RegisterRequest from your Swagger
 */
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
  role: string;
}