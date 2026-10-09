'use client';
import { useCallback, useRef, useEffect } from 'react';
import { useClassroomQuestionMutation } from './useClassroomQueries';
import { useConversationSession } from '@/shared/hooks/useConversationSession';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import {
  setLoading,
  setLoadingStatus,
  setError,
  setChunks,
  setDiagramType,
  setTopic,
  setChalkboardPoints,
  resetClassroomState,
} from '@/features/classroom/state/classroomSlice';
import type { ExtendedChunk, DiagramType } from '@/types';

export function useClassroomApi() {
  const dispatch = useAppDispatch();
  const topic = useAppSelector((s) => s.classroom.topic);
  const esRef = useRef<AbortController | null>(null);
  const { mutateAsync } = useClassroomQuestionMutation();
  const getSessionId = useConversationSession();
  useEffect(() => () => esRef.current?.abort(), []);

  const sendQuestion = useCallback(
    async (question: string) => {
      // Cancel any in-flight stream
      esRef.current?.abort();
      const controller = new AbortController();
      esRef.current = controller;

      dispatch(resetClassroomState());
      dispatch(setLoading(true));
      dispatch(setLoadingStatus('Connecting to AI Tutor…'));

      const sessionId = getSessionId();

      try {
        const data = await mutateAsync({ question, sessionId, signal: controller.signal });
        if (controller.signal.aborted) return;
        const diagType = (data.diagram_type ?? 'default') as DiagramType;
        const chunks: ExtendedChunk[] = (data.chunks ?? []).map((c) => ({
          speak: c.speak ?? '',
          key_point: c.key_point ?? c.speak ?? null,
          diagram: c.diagram,
          teacher_position: c.teacher_position ?? 'left',
        }));

        const points: string[] = chunks
          .map((c) => c.key_point)
          .filter(Boolean) as string[];

        // If no explicit points, extract concise short points
        const finalPoints =
          points.length > 0
            ? points
            : [
                question,
                data.topic ? `Topic: ${data.topic}` : 'Core Principles & Dynamics',
                chunks[0]?.speak.slice(0, 80) ?? question,
              ];

        dispatch(setTopic(topic || data.topic || question));
        dispatch(setDiagramType(diagType));
        dispatch(setChunks(chunks));
        dispatch(setChalkboardPoints(finalPoints));
        dispatch(setLoading(false));
        dispatch(setLoadingStatus(''));
      } catch (err) {
        if (controller.signal.aborted) return;
        dispatch(setError(err instanceof Error ? err.message : 'Unable to get a response.'));
        dispatch(setLoading(false));
        dispatch(setLoadingStatus(''));
      }
    },
    [dispatch, mutateAsync, getSessionId, topic]
  );

  const cancelStream = useCallback(() => {
    esRef.current?.abort();
    dispatch(setLoading(false));
  }, [dispatch]);

  return { sendQuestion, cancelStream };
}

