/**
 * Form-related UI types
 */

export interface FormState {
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export interface FieldError {
  field: string;
  message: string;
}
