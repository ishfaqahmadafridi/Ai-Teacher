import { apiClient } from '@/lib/api';
import type { SearchGroupedResults } from '../types/topbar.types';
export async function fetchSearchResultsFromBackend(rawQuery: string, signal?: AbortSignal): Promise<SearchGroupedResults> {
  const response = await apiClient.get<SearchGroupedResults>('/api/search/', {
    params: { q: rawQuery.trim(), limit: 10 }, signal,
  });
  return response.data;
}
