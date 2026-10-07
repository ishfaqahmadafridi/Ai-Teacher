'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../state/authStore';
import { AuthService } from '../services/authService';
import { queryKeys } from '@/shared/constants/queryConstants';
import type { AuthUser, ProfileUpdateData } from '../types';

export function useProfileQuery(enabled = true) {
  const userId = useAuthStore(state => state.user?.id);
  const token = useAuthStore(state => state.accessToken);
  return useQuery({
    queryKey: queryKeys.profile(userId),
    enabled: enabled && !!userId && !!token,
    queryFn: async ({ signal }) => {
      const user = await AuthService.getProfile(signal);
      const current = useAuthStore.getState();
      if (signal.aborted || current.user?.id !== userId || !current.accessToken) throw new Error('The signed-in account changed.');
      if (user.id !== userId) { current.clearAuth(); throw new Error('Unable to verify your account.'); }
      current.setUser(user, current.accessToken);
      return user;
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useProfileMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (save: () => Promise<AuthUser>) => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Please sign in before saving your profile.');
      await client.cancelQueries({ queryKey: queryKeys.profile(userId) });
      if (useAuthStore.getState().user?.id !== userId) throw new Error('The signed-in account changed.');
      const user = await save();
      const current = useAuthStore.getState();
      if (current.user?.id !== userId || user.id !== userId || !current.accessToken) throw new Error('The signed-in account changed.');
      current.setUser(user, current.accessToken);
      client.setQueryData(queryKeys.profile(userId), user);
      void client.invalidateQueries({ queryKey: queryKeys.dashboard(userId) });
      return user;
    },
  });
}
export function useUpdateProfileMutation() {
  const mutation = useProfileMutation();
  return { ...mutation, mutateAsync: (data: ProfileUpdateData) => mutation.mutateAsync(() => AuthService.updateProfile(data)) };
}
export function useLoginMutation() {
  const client = useQueryClient();
  return useMutation({ mutationFn: AuthService.login, onSuccess: async () => { await client.cancelQueries(); client.clear(); } });
}
export function useRegisterMutation() {
  const client = useQueryClient();
  return useMutation({ mutationFn: AuthService.register, onSuccess: async () => { await client.cancelQueries(); client.clear(); } });
}
export function useLogoutMutation() { return useMutation({ mutationFn: AuthService.logout }); }
