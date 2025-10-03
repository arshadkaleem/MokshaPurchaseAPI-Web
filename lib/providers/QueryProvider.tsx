'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create a client instance per request to avoid sharing state between users
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // MVP settings - balance between freshness and performance
            staleTime: 60 * 1000, // 1 minute - data is fresh for 1 min
            cacheTime: 5 * 60 * 1000, // 5 minutes - cache cleared after 5 min
            retry: 1, // Only retry once on failure
            refetchOnWindowFocus: false, // Don't refetch when window regains focus (MVP)
            refetchOnMount: true, // Refetch when component mounts
          },
          mutations: {
            retry: 0, // Don't retry mutations (create, update, delete)
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools - only shows in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}