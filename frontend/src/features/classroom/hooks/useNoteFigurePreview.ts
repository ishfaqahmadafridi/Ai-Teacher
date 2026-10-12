'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/state/authStore';
import { lectureNotesService } from '../services/lectureNotesService';
import { blobAsDataUrl } from '../utilities/downloadNotesUtils';
export function useNoteFigurePreview(noteId: string, index: number) {
  const userId = useAuthStore(state => state.user?.id);
  return useQuery({ queryKey: ['lecture-notes', userId, noteId, 'figure', index], enabled: !!userId,
    queryFn: async ({ signal }) => blobAsDataUrl(await lectureNotesService.figure(noteId, index, signal)) });
}
