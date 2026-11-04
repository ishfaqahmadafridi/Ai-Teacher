'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLessonRecovery } from './useLessonRecovery';
import { useRestoreLesson } from './useRestoreLesson';
import { useScheduledClass } from './useScheduledClass';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { resetClassroomState, setScheduledSessionId, setCourseTitle, setError } from '../state/classroomSlice';
import { useClassroomApi } from './useClassroomApi';
import { useChunkPlayer } from './useChunkPlayer';
import { classroomErrorMessage } from '../utilities/classroomErrors';

export function useClassroomLayout() {
  const scheduled = useScheduledClass();
  useLessonRecovery(!scheduled.sessionId);
  const restore = useRestoreLesson();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const classroom = useAppSelector(state => state.classroom);
  const { loading, isPlaying, chunks, pendingQuestion, currentChunkIndex, error, loadingStatus, diagramType, currentCommand, currentFormula } = classroom;
  const { sendQuestion, cancelStream } = useClassroomApi({ recoverPending: !scheduled.sessionId || scheduled.phase === 'live' });
  const { playFrom, stop } = useChunkPlayer();
  const startupRef = useRef<AbortController | null>(null);
  const endedRef = useRef<string | null>(null);
  const canTeach = !scheduled.sessionId || (scheduled.phase === 'live' && classroom.classPhase === 'live');

  useEffect(() => {
    if (!scheduled.sessionId || !['waiting', 'live'].includes(scheduled.phase) || classroom.classPhase !== scheduled.phase || scheduled.sessionId !== classroom.scheduledSessionId || !scheduled.session) return;
    if (chunks.length || loading || (startupRef.current && !startupRef.current.signal.aborted)) return;
    const controller = new AbortController();
    startupRef.current = controller;
    const request = scheduled.session.noteId
      ? restore(scheduled.session.noteId, controller.signal)
      : sendQuestion(`Teach the scheduled lesson: ${scheduled.session.lessonTitle}.`, scheduled.sessionId);
    void request.catch(problem => {
      if (!controller.signal.aborted) dispatch(setError(classroomErrorMessage(problem, 'Unable to start this class.')));
    });
    return () => controller.abort();
    // A loading update must not cancel the startup that caused it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduled.sessionId, scheduled.phase, scheduled.session, classroom.scheduledSessionId, classroom.classPhase, restore, sendQuestion, dispatch]);

  useEffect(() => {
    if (!scheduled.sessionId || scheduled.phase !== 'ended' || endedRef.current === scheduled.sessionId) return;
    endedRef.current = scheduled.sessionId;
    startupRef.current?.abort();
    cancelStream();
    stop();
    dispatch(resetClassroomState());
    dispatch(setScheduledSessionId(null));
    dispatch(setCourseTitle(''));
    router.replace('/dashboard');
  }, [scheduled.sessionId, scheduled.phase, cancelStream, stop, dispatch, router]);

  useEffect(() => {
    if (scheduled.error) dispatch(setError('Unable to verify this scheduled class. Please return to your timetable and rejoin.'));
  }, [scheduled.error, dispatch]);

  useEffect(() => {
    if (canTeach && chunks.length > 0 && !isPlaying && !pendingQuestion && currentChunkIndex < chunks.length) {
      playFrom(Math.max(0, currentChunkIndex));
    }
    // Start on a new lesson or a scheduled transition, not on playback completion/errors.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunks, canTeach]);

  return { loading, isPlaying, chunks, error, loadingStatus, diagramType, currentCommand, currentFormula, sendQuestion };
}
