import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useOnboardingStore } from '../../onboarding/state/onboardingStore';
import type { AuthUser, AuthState } from '../types';

interface AuthActions {
  setUser: (user: AuthUser, token: string, refreshToken?: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setUser: (user: AuthUser, token: string, refreshToken?: string) => {
          const previous = get();
          if (previous.user?.id !== user.id) {
            useOnboardingStore.getState().bindUser(user);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('dashboard_profile');
              localStorage.removeItem('token');
            }
          }
          set({
            user, accessToken: token,
            refreshToken: refreshToken ?? (previous.user?.id === user.id ? previous.refreshToken : null),
            isAuthenticated: true, error: null,
          }, false, 'auth/setUser');
        },

        clearAuth: () => {
          useOnboardingStore.getState().resetOnboarding();
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('dashboard_profile');
          }
          set(initialState, false, 'auth/clearAuth');
        },

        setLoading: (loading: boolean) =>
          set({ isLoading: loading }, false, 'auth/setLoading'),

        setError: (error: string | null) =>
          set({ error, isLoading: false }, false, 'auth/setError'),
      }),
      {
        name: 'auth-store',
        version: 1,
        migrate: () => initialState,
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);
