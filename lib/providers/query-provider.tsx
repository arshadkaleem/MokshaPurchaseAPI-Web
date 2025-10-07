'use client'; // This is a Next.js directive - means this runs on client side

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * Query Client Provider
 * 
 * C# equivalent: Setting up DI container in Program.cs
 * 
 * services.AddMemoryCache();
 * services.AddScoped<IProjectService, ProjectService>();
 */

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create QueryClient instance
  // useState ensures it's created once per app lifecycle
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // How long data is considered fresh (no refetch needed)
            staleTime: 60 * 1000, // 1 minute
            
            // How long unused data stays in cache
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            
            // Retry failed requests
            retry: 3,
            
            // Retry with exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            
            // Refetch on window focus
            refetchOnWindowFocus: false, // Turn off for development
            
            // Refetch on reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry failed mutations
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools - only shows in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}