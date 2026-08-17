import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient, BASE_URL } from './client';
import { useAuthStore } from '@/features/auth/state/authStore';

export function setupInterceptors() {
  // ─── Request Interceptor: Attach JWT Bearer Token ───────────────────────────
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const storeToken = useAuthStore.getState().accessToken;
      let token = storeToken;

      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('token');
        if (!token) {
          try {
            const persisted = localStorage.getItem('auth-store');
            if (persisted) {
              const parsed = JSON.parse(persisted);
              token = parsed.state?.accessToken || null;
            }
          } catch {
            // Ignore JSON parse errors
          }
        }
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // ─── Response Interceptor: Centralized Error & Refresh Handler ───────────────
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // 1. Connection Refused / Network Error
      if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        const friendlyMessage =
          'Unable to connect to backend server. Please verify the backend service is running on http://127.0.0.1:8000.';
        return Promise.reject(new Error(friendlyMessage));
      }

      const { status, data } = error.response;

      // 2. Refresh Token Handling on 401 Unauthorized
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshResponse = await axios.post(`${BASE_URL}/api/auth/refresh/`, {}, { withCredentials: true });
          const newAccessToken = refreshResponse.data.access;

          if (newAccessToken) {
            const user = useAuthStore.getState().user;
            if (user) {
              useAuthStore.getState().setUser(user, newAccessToken);
            }
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return apiClient(originalRequest);
          }
        } catch {
          useAuthStore.getState().clearAuth();
        }
      }

      // 3. Extract readable error message
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (data && typeof data === 'object') {
        const payload = data as Record<string, unknown>;
        if (typeof payload.detail === 'string') {
          errorMessage = payload.detail;
        } else if (typeof payload.message === 'string') {
          errorMessage = payload.message;
        } else if (typeof payload.error === 'string') {
          errorMessage = payload.error;
        } else {
          const firstKey = Object.keys(payload)[0];
          const val = payload[firstKey];
          if (Array.isArray(val) && typeof val[0] === 'string') {
            errorMessage = `${firstKey}: ${val[0]}`;
          }
        }
      }

      return Promise.reject(new Error(errorMessage));
    }
  );
}

// Initialize interceptors automatically
setupInterceptors();
