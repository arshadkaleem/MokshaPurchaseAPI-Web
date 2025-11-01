import { z } from 'zod';

/**
 * Login form validation schema
 * 
 * C# equivalent: LoginRequest with Data Annotations
 * 
 * [Required]
 * [EmailAddress]
 * public string Email { get; set; }
 */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register form validation schema
 *
 * C# equivalent: RegisterRequest with Data Annotations
 *
 * [Required]
 * [EmailAddress]
 * public string Email { get; set; }
 *
 * [Required]
 * [Compare("Password")]
 * public string ConfirmPassword { get; set; }
 */

export const registerSchema = z.object({
  userName: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),

  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),

  role: z
    .string()
    .min(1, 'Role is required')
    .default('User'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Available user roles in the system
 * C# equivalent: enum UserRole or Role constants
 */
export const USER_ROLES = [
  'AUDITOR',
  'INVENTORYMANAGER',
  'PROCUREMENT',
  'COMPLIANCEOFFICER',
  'MANAGER',
  'PROJECTMANAGER',
  'FINANCE',
  'WAREHOUSESTAFF',
  'PURCHASINGOFFICER',
] as const;

export type UserRole = typeof USER_ROLES[number];