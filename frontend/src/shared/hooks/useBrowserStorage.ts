'use client';
import { useCallback, useSyncExternalStore } from 'react';
export function useBrowserStorage(key: string) {
  const subscribe = useCallback((notify: () => void) => {
    const listener = (event: StorageEvent) => { if (event.key === key || event.key === null) notify(); };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, [key]);
  const snapshot = useCallback(() => { try { return localStorage.getItem(key); } catch { return null; } }, [key]);
  return useSyncExternalStore(subscribe, snapshot, () => null);
}
