export const QUERY_STALE_TIME = 60_000;
export const QUERY_GC_TIME = 5 * 60_000;
export const SEARCH_DEBOUNCE_TIME = 300;
export const queryKeys = {
  account: (userId: string | undefined) => ['account', userId] as const,
  profile: (userId: string | undefined) => ['account', userId, 'profile'] as const,
  dashboard: (userId: string | undefined) => ['account', userId, 'dashboard'] as const,
  search: (userId: string | undefined, query: string) => ['account', userId, 'search', query] as const,
};
