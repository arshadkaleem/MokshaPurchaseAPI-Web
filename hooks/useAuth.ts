/**
 * Custom hook for authentication
 * Re-exports useAuthContext for cleaner imports
 */

import { useAuthContext } from '@/contexts/AuthContext';

export const useAuth = useAuthContext;
