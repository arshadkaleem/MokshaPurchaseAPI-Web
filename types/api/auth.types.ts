/**
 * Authentication types
 */

import { UserRole } from '@/types/enums/user-role.enum';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;      // ✅ Changed from 'token' to 'accessToken'
  expiresIn: number;
  tokenType: string;
  user: UserResponse;
}

export interface UserResponse {
  userId: string;            // ✅ Changed from 'id' to 'userId'
  email: string;
  userName: string;          // ✅ Changed from 'name' to 'userName'
  role: UserRole;
  createdAt?: string;
}