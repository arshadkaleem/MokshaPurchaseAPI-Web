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