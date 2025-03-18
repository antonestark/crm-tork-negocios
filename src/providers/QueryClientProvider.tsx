
import React from 'react';
import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface QueryClientProviderProps {
  children: React.ReactNode;
}

export function QueryClientProvider({ children }: QueryClientProviderProps) {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
}
