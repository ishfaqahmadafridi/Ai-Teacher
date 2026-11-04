'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/state/authStore';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setClassPhase, setCourseTitle, setScheduledSessionId, resetClassroomState } from '../state/classroomSlice';
import { scheduledClassService } from '../services/scheduledClassService';
import { scheduledClassPhase } from '../utilities/scheduledClassPhase';
import { CLASSROOM_SESSION_QUERY_PARAM, CLASSROOM_SESSION_TICK_MS, CLASSROOM_SESSION_REFRESH_MS } from '../constants/sessionConstants';

export function useScheduledClass() {
  const params = useSearchParams();
  const storedSessionId = useAppSelector(state => state.classroom.scheduledSessionId);
  const sessionId = params.get(CLASSROOM_SESSION_QUERY_PARAM) || storedSessionId;
  const userId = useAuthStore(state => state.user?.id);
  const dispatch = useAppDispatch();
  const [now, setNow] = useState(() => performance.now());
  const query = useQuery({
    queryKey: ['scheduled-class', userId, sessionId], enabled: !!userId && !!sessionId,
    queryFn: ({ signal }) => scheduledClassService.read(sessionId!, signal),
    refetchInterval: CLASSROOM_SESSION_REFRESH_MS, refetchOnWindowFocus: 'always',
  });
  const phase = !sessionId ? 'self-study' : query.data ? scheduledClassPhase(query.data, now) : 'checking';
  useEffect(() => {
    if (sessionId !== storedSessionId) {
      dispatch(resetClassroomState());
      dispatch(setScheduledSessionId(sessionId ?? null));
    }
  }, [sessionId, storedSessionId, dispatch]);
  useEffect(() => { dispatch(setClassPhase(phase)); }, [phase, dispatch]);
  useEffect(() => {
    if (query.data) dispatch(setCourseTitle(query.data.courseTitle));
  }, [query.data, dispatch]);
  useEffect(() => {
    if (!sessionId) return;
    const timer = setInterval(() => setNow(performance.now()), CLASSROOM_SESSION_TICK_MS);
    return () => clearInterval(timer);
  }, [sessionId]);
  return { sessionId, phase, session: query.data, error: query.error };
}
