'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/state/authStore';
import { queryKeys } from '@/shared/constants/queryConstants';
import { ClassroomService } from '../services/classroomService';
import type { ClassroomQuestion } from '../types/api.types';
export function useClassroomQuestionMutation() {
  return useMutation({ mutationFn: async (question: ClassroomQuestion) => {
    const account = useAuthStore.getState().user?.id;
    const answer = await ClassroomService.askQuestion(question);
    if (question.signal?.aborted || useAuthStore.getState().user?.id !== account) throw new Error('The signed-in account changed.');
    return answer;
  } });
}
export function useClassroomHealthQuery(enabled = true) {
  const userId = useAuthStore(state => state.user?.id);
  return useQuery({ queryKey: [...queryKeys.account(userId), 'classroom', 'health'],
    enabled: enabled && !!userId, queryFn: ({ signal }) => ClassroomService.checkHealth(signal) });
}
