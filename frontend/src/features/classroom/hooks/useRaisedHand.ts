'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setHandRaised, setError } from '../state/classroomSlice';
import { lessonHandService } from '../services/lessonHandService';

export function useRaisedHand() {
  const { noteId, handRaised, classPhase } = useAppSelector(state => state.classroom);
  const dispatch = useAppDispatch();
  const request = useRef<AbortController | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    dispatch(setHandRaised(false));
    if (noteId) void lessonHandService.read(noteId, controller.signal).then(result => {
      if (!controller.signal.aborted) dispatch(setHandRaised(result.hand_raised));
    }).catch(() => {
      if (!controller.signal.aborted) dispatch(setError('Your raised-hand status could not be loaded.'));
    });
    return () => { controller.abort(); request.current?.abort(); request.current = null; };
  }, [noteId, dispatch]);
  const handleToggleHand = useCallback(async () => {
    if (!noteId || request.current || (classPhase && !['live', 'self-study'].includes(classPhase))) return;
    const controller = new AbortController();
    request.current = controller;
    try {
      const result = await lessonHandService.set(noteId, !handRaised, controller.signal);
      if (!controller.signal.aborted) dispatch(setHandRaised(result.hand_raised));
    } catch {
      if (!controller.signal.aborted) dispatch(setError('Your hand request could not be saved. Please try again.'));
    } finally { if (request.current === controller) request.current = null; }
  }, [noteId, handRaised, classPhase, dispatch]);
  return { handRaised: Boolean(handRaised), handleToggleHand };
}
