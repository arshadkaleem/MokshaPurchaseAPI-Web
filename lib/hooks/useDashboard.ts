import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/lib/api/dashboard';

/**
 * Custom hook to fetch dashboard data
 *
 * Uses React Query for caching and automatic refetching
 */
export function useDashboard(period: 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: ['dashboard', period],
    queryFn: () => getDashboardData(period),
    // Refetch every 5 minutes to keep dashboard data fresh
    refetchInterval: 5 * 60 * 1000,
    // Keep previous data while fetching new data
    placeholderData: (previousData) => previousData,
  });
}
