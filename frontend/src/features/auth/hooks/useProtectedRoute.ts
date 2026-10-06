'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../state/authStore';
import { useProfileQuery } from './useAuthQueries';
function subscribeHydration(onChange: () => void) { return useAuthStore.persist.onFinishHydration(onChange); }
const hydrationSnapshot = () => useAuthStore.persist.hasHydrated();
const serverHydrationSnapshot = () => false;
export function useProtectedRoute() {
  const router = useRouter();
  const userId = useAuthStore(state => state.user?.id);
  const token = useAuthStore(state => state.accessToken);
  const hydrated = useSyncExternalStore(subscribeHydration, hydrationSnapshot, serverHydrationSnapshot);
  const profile = useProfileQuery(hydrated);
  useEffect(() => { if (hydrated && (!token || !userId)) router.replace('/login'); }, [hydrated, token, userId, router]);
  return {
    allowed: hydrated && !!token && profile.isFetchedAfterMount && profile.isSuccess && profile.data.id === userId,
    error: profile.error?.message ?? null,
    retry: () => { void profile.refetch(); },
  };
}
