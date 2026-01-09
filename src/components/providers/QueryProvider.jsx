import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QUERY_CONFIG } from '../../utils/constants';

// Crear cliente de React Query con configuración optimizada para PWA
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.staleTime,
      gcTime: QUERY_CONFIG.cacheTime, // gcTime reemplaza cacheTime en v5
      refetchOnWindowFocus: QUERY_CONFIG.refetchOnWindowFocus,
      retry: QUERY_CONFIG.retry,
      // Importante para PWA: no refetch automático en reconnect
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default QueryProvider;
