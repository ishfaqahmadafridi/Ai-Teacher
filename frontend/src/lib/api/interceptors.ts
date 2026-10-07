import axios, { AxiosError } from 'axios';
import type { AuthenticatedRequestConfig } from './types';
import { apiClient, BASE_URL } from './client';
import { useAuthStore } from '@/features/auth/state/authStore';

let refreshRequest: Promise<string> | null = null;

export function setupInterceptors() {
  apiClient.interceptors.request.use((config: AuthenticatedRequestConfig) => {
    const session = useAuthStore.getState();
    const token = session.accessToken;
    if (!config._retry) config._accountId = session.user?.id;
    const publicAuth = /\/api\/auth\/(login|register|google)\//.test(config.url ?? '');
    if (token && !publicAuth) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, undefined, { synchronous: true });

  apiClient.interceptors.response.use((response) => response, async (error: AxiosError) => {
    const original = error.config as AuthenticatedRequestConfig | undefined;
    if (axios.isCancel(error)) return Promise.reject(error);
    if (!error.response) {
      return Promise.reject(new Error('Unable to connect to the backend server.'));
    }
    const { status, data } = error.response;
    const publicAuth = /\/api\/auth\/(login|register|google|refresh|logout)\//.test(original?.url ?? '');
    if (status === 401 && original && !original._retry && !publicAuth) {
      original._retry = true;
      const session = useAuthStore.getState();
      if (original._accountId && original._accountId !== session.user?.id) {
        return Promise.reject(new Error('The signed-in account changed.'));
      }
      if (session.refreshToken && session.user) {
        try {
          if (!refreshRequest) {
            const refreshToken = session.refreshToken;
            const userId = session.user.id;
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
          const access = await refreshRequest;
          if (useAuthStore.getState().user?.id !== session.user.id) throw new Error('The signed-in account changed.');
          original.headers.Authorization = `Bearer ${access}`;
          return apiClient(original);
        } catch {
          const current = useAuthStore.getState();
          if (current.user?.id === session.user.id && current.refreshToken === session.refreshToken) {
            current.clearAuth();
          }
        }
      } else {
        session.clearAuth();
      }
    }
    let message = 'An unexpected error occurred. Please try again.';
    if (data && typeof data === 'object') {
      const payload = data as Record<string, unknown>;
      const direct = [payload.detail, payload.message, payload.error].find((value) => typeof value === 'string');
      if (typeof direct === 'string') message = direct;
      else {
        const key = Object.keys(payload)[0];
        const value = payload[key];
        if (Array.isArray(value) && typeof value[0] === 'string') message = `${key}: ${value[0]}`;
      }
    }
    return Promise.reject(new Error(message));
  });
}

setupInterceptors();
