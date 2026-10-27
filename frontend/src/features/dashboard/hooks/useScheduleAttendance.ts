'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/state/authStore';
import { useAppDispatch } from '@/hooks/useAppStore';
import { setInputText, setCourseTitle, setScheduledSessionId } from '@/features/classroom/state/classroomSlice';
import { TimetableService } from '@/services/timetableService';

export function useScheduleAttendance(onJoinClass?: (id: string) => void) {
  const dispatch = useAppDispatch();
  const client = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  const [error, setError] = useState<string | null>(null);
  const join = useCallback(async (id: string) => {
    try {
      setError(null);
      const lesson = await TimetableService.join(id);
      await client.invalidateQueries({ queryKey: ['saved-timetable', userId] });
      if (useAuthStore.getState().user?.id === userId) {
        dispatch(setCourseTitle(lesson.courseTitle));
        dispatch(setScheduledSessionId(lesson.sessionId || id));
        dispatch(setInputText(`Teach me ${lesson.lessonTitle || 'the scheduled topic'} for ${lesson.courseTitle}.`));
        onJoinClass?.(id);
      }
    } catch {
      setError('Unable to join this session. Check its scheduled time and try again.');
    }
  }, [client, userId, onJoinClass, dispatch]);
  return { join, error };
}
