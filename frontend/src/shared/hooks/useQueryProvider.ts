'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/state/authStore';
import { getQueryClient } from '../utilities/queryClient';

export function useQueryProvider() {
  const client = getQueryClient();
  useEffect(() => useAuthStore.subscribe((current, previous) => {
    if (current.user?.id !== previous.user?.id || (!current.accessToken && previous.accessToken)) {
      void client.cancelQueries();
      client.clear();
    }
  }), [client]);
  return client;
}
