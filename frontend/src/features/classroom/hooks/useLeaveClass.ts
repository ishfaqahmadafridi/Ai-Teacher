'use client';
import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/useAppStore';
import { setCourseTitle, setScheduledSessionId } from '../state/classroomSlice';
export function useLeaveClass() {
  const dispatch = useAppDispatch();
  const leave = useCallback(() => { dispatch(setCourseTitle('')); dispatch(setScheduledSessionId(null)); }, [dispatch]);
  return { leave };
}
