import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthUser, AuthState } from '../types';

interface AuthActions {
  setUser: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setUser: (user: AuthUser, token: string) =>
          set(
            {
              user,
              accessToken: token,
              isAuthenticated: true,
              error: null,
            },
            false,
            'auth/setUser'
          ),

        clearAuth: () =>
          set(initialState, false, 'auth/clearAuth'),

        setLoading: (loading: boolean) =>
          set({ isLoading: loading }, false, 'auth/setLoading'),

        setError: (error: string | null) =>
          set({ error, isLoading: false }, false, 'auth/setError'),
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);
