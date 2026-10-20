import axios from 'axios';
import { BASE_URL } from './client';
import { useAuthStore } from '@/features/auth/state/authStore';

let refreshRequest: Promise<string> | null = null;

/** Share token rotation between Axios requests and authenticated fetch streams. */
export async function refreshAccessToken(accountId?: string): Promise<string> {
  const session = useAuthStore.getState();
  if (!session.user || !session.refreshToken || (accountId && accountId !== session.user.id)) {
    throw new Error('Please sign in again.');
  }
  const userId = session.user.id;
  if (!refreshRequest) {
    const refreshToken = session.refreshToken;
    refreshRequest = axios.post<{ access: string; refresh: string }>(
      `${BASE_URL}/api/auth/refresh/`, { refresh: refreshToken }, { timeout: 15000 }
    ).then(({ data: tokens }) => {
      const current = useAuthStore.getState();
      if (!current.user || current.user.id !== userId || current.refreshToken !== refreshToken) {
        throw new Error('The signed-in account changed.');
      }
      current.setUser(current.user, tokens.access, tokens.refresh);
      return tokens.access;
    }).finally(() => { refreshRequest = null; });
  }
  const token = await refreshRequest;
  if (useAuthStore.getState().user?.id !== userId) throw new Error('The signed-in account changed.');
  return token;
}
