'use client';
import { readPendingLessonJob } from '../utilities/pendingLessonJob';
import { useCallback, useRef, useEffect } from 'react';
import { useClassroomQuestionMutation } from './useClassroomQueries';
import { useConversationSession } from '@/shared/hooks/useConversationSession';
import { useAppSelector } from '@/hooks/useAppStore';
import { useAppDispatch } from '@/hooks/useAppStore';
import {
  setScheduledSessionId,
  setInputText,
  setLoading,
  setLoadingStatus,
  setError,
  setChunks,
  setNoteId,
  setDiagramType,
  setTopic,
  setChalkboardPoints,
  resetClassroomState,
} from '@/features/classroom/state/classroomSlice';
import type { ExtendedChunk, DiagramType } from '@/types';
import type { UseClassroomApiOptions } from '../types/api.types';

export function useClassroomApi({ recoverPending = false }: UseClassroomApiOptions = {}) {
  const dispatch = useAppDispatch();
  const scheduledSessionId = useAppSelector(state => state.classroom.scheduledSessionId);
  const esRef = useRef<AbortController | null>(null);
  const recoveredJobRef = useRef<string | null>(null);
  const { mutateAsync } = useClassroomQuestionMutation();
  const getSessionId = useConversationSession();
  useEffect(() => () => {
    if (esRef.current && !esRef.current.signal.aborted) {
      esRef.current.abort();
      dispatch(setLoading(false));
      dispatch(setLoadingStatus(''));
    }
  }, [dispatch]);

  const sendQuestion = useCallback(
    async (question: string, recoveredSessionId?: string) => {
      // Cancel any in-flight stream
      esRef.current?.abort();
      const controller = new AbortController();
      esRef.current = controller;

      const currentSessionId = recoveredSessionId ?? scheduledSessionId;
      dispatch(setScheduledSessionId(currentSessionId ?? null));
      dispatch(resetClassroomState());
      dispatch(setInputText(question));
      dispatch(setLoading(true));
      dispatch(setLoadingStatus('Connecting to AI Tutor…'));

      const sessionId = getSessionId();

      try {
        const data = await mutateAsync({ question, sessionId, scheduledSessionId: currentSessionId, signal: controller.signal, onStatus: status => { if (!controller.signal.aborted) dispatch(setLoadingStatus(status)); } });
        if (controller.signal.aborted) return;
        const diagType = (data.diagram_type ?? 'default') as DiagramType;
        const chunks: ExtendedChunk[] = (data.chunks ?? []).map((c) => ({
          speak: c.speak ?? '',
          question: c.question,
          expected_concepts: c.expected_concepts,
          key_point: c.key_point ?? c.speak ?? null,
          diagram: c.diagram,
          teacher_position: c.teacher_position ?? 'left',
        }));

        dispatch(setTopic(data.topic || question));
        dispatch(setDiagramType(diagType));
        dispatch(setNoteId(data.model_info?.note_id ?? null));
        dispatch(setChunks(chunks));
        dispatch(setChalkboardPoints([]));
        dispatch(setLoading(false));
        dispatch(setLoadingStatus(''));
      } catch (err) {
        if (controller.signal.aborted) return;
        dispatch(setError(err instanceof Error ? err.message : 'Unable to get a response.'));
        dispatch(setLoading(false));
        dispatch(setLoadingStatus(''));
      }
    },
    [dispatch, mutateAsync, getSessionId, scheduledSessionId]
  );

  useEffect(() => {
    if (!recoverPending) return;
    const pending = readPendingLessonJob(getSessionId());
    if (pending && (!scheduledSessionId || pending.scheduledSessionId === scheduledSessionId)) {
      if (recoveredJobRef.current === pending.id && esRef.current && !esRef.current.signal.aborted) return;
      recoveredJobRef.current = pending.id;
      void sendQuestion(pending.question, pending.scheduledSessionId ?? undefined);
    }
  }, [recoverPending, getSessionId, sendQuestion, scheduledSessionId]);

  const cancelStream = useCallback(() => {
    esRef.current?.abort();
    dispatch(setLoading(false));
  }, [dispatch]);

  return { sendQuestion, cancelStream };
}

