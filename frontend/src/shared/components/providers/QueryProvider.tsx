'use client';
import { memo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useQueryProvider } from '../../hooks/useQueryProvider';
import type { QueryProviderProps } from '../../types/query.types';
export const QueryProvider = memo(function QueryProvider({ children }: QueryProviderProps) {
  const client = useQueryProvider();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
});
QueryProvider.displayName = 'QueryProvider';
