'use client';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from '@/features/auth/state/authStore';
export function useConversationSession() {
  return useCallback(() => {
    const key = `ai_teacher_session_id:${useAuthStore.getState().user?.id ?? 'guest'}`;
    if (typeof window === 'undefined') return uuidv4();
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const id = uuidv4();
    sessionStorage.setItem(key, id);
    return id;
  }, []);
}
