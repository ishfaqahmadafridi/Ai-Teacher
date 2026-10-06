'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../state/authStore';
import { AuthService } from '../services/authService';

function subscribeHydration(onChange: () => void) {
  return useAuthStore.persist.onFinishHydration(onChange);
}
const hydrationSnapshot = () => useAuthStore.persist.hasHydrated();
const serverHydrationSnapshot = () => false;

export function useProtectedRoute() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);
  const token = useAuthStore((state) => state.accessToken);
  const hydrated = useSyncExternalStore(subscribeHydration, hydrationSnapshot, serverHydrationSnapshot);
  const [validated, setValidated] = useState<{ token: string; userId: string } | null>(null);
  const [failure, setFailure] = useState<{ token: string; message: string } | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!hydrated) return;
    if (!token || !userId) {
      router.replace('/login');
      return;
    }
    let active = true;
    AuthService.getProfile().then((user) => {
      const current = useAuthStore.getState();
      if (!active || current.user?.id !== userId || !current.accessToken) return;
      if (user.id !== userId) {
        current.clearAuth();
        router.replace('/login');
        return;
      }
      current.setUser(user, current.accessToken);
      setValidated({ token: current.accessToken, userId: user.id });
      setFailure(null);
    }).catch((error: unknown) => {
      if (!active) return;
      setFailure({ token, message: error instanceof Error ? error.message : 'Unable to verify your account.' });
    });
    return () => { active = false; };
  }, [hydrated, token, userId, router, attempt]);

  const retry = useCallback(() => {
    setFailure(null);
    setValidated(null);
    setAttempt((value) => value + 1);
  }, []);

  return {
    allowed: hydrated && !!token && validated?.token === token && validated.userId === userId,
    error: failure?.token === token ? failure.message : null,
    retry,
  };
}
