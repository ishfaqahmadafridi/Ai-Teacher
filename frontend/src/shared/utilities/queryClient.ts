import { QueryClient } from '@tanstack/react-query';
import { QUERY_STALE_TIME, QUERY_GC_TIME } from '../constants/queryConstants';

export function createQueryClient() {
  return new QueryClient({ defaultOptions: {
    queries: { staleTime: QUERY_STALE_TIME, gcTime: QUERY_GC_TIME, retry: false },
    mutations: { retry: false, gcTime: 0 },
  } });
}
let browserClient: QueryClient | undefined;
export function getQueryClient() {
  if (typeof window === 'undefined') return createQueryClient();
  return browserClient ??= createQueryClient();
}
