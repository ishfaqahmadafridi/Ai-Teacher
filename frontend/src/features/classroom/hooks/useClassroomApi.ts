'use client';
import { useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from '@/hooks/useAppStore';
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
import type { TeachingResponse, ExtendedChunk, DiagramType } from '@/features/classroom/types/classroom.types';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';
const SESSION_KEY = 'ai_teacher_session_id';

function getSessionId(): string {
  if (typeof window === 'undefined') return uuidv4();
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useClassroomApi() {
  const dispatch = useAppDispatch();
  const esRef = useRef<EventSource | null>(null);

  const sendQuestion = useCallback(
    async (question: string) => {
      // Cancel any in-flight stream
      esRef.current?.close();

      dispatch(resetClassroomState());
      dispatch(setLoading(true));
      dispatch(setLoadingStatus('Connecting to Prof. Gemini…'));

      const sessionId = getSessionId();
      const url = `${BACKEND_URL}/api/physics-teacher/explain/?question=${encodeURIComponent(question)}&session_id=${encodeURIComponent(sessionId)}`;

      const es = new EventSource(url, { withCredentials: true });
      esRef.current = es;

      let buffer = '';

      es.onmessage = (event: MessageEvent) => {
        try {
          const parsed = JSON.parse(event.data as string) as Record<string, unknown>;

          if (parsed.status === 'thinking') {
            dispatch(setLoadingStatus(String(parsed.message ?? 'Thinking…')));
          } else if (parsed.status === 'result') {
            const teaching = parsed.data as TeachingResponse;
            const diagType = (teaching.diagram_type ?? 'default') as DiagramType;
            const chunks: ExtendedChunk[] = teaching.phases.map((p) => ({
              speak: p.speak,
              key_point: p.key_point ?? null,
              diagram: p.diagram_action
                ? {
                    action: p.diagram_action as ExtendedChunk['diagram'] extends undefined
                      ? never
                      : NonNullable<ExtendedChunk['diagram']>['action'],
                    target: p.diagram_target,
                    animate: p.animate,
                    annotation: p.annotation,
                    annotation_position: p.annotation_position,
                  }
                : undefined,
              teacher_position: p.teacher_position ?? 'left',
            }));

            const points = chunks
              .map((c) => c.key_point)
              .filter(Boolean) as string[];

            dispatch(setTopic(teaching.topic));
            dispatch(setDiagramType(diagType));
            dispatch(setChunks(chunks));
            dispatch(setChalkboardPoints(points));
            dispatch(setLoading(false));
            dispatch(setLoadingStatus(''));
            es.close();
          } else if (parsed.status === 'stream') {
            buffer += String(parsed.token ?? '');
            dispatch(setLoadingStatus(buffer.slice(-60)));
          }
        } catch {
          // Ignore non-JSON messages
        }
      };

      es.onerror = () => {
        dispatch(setError('Connection error. Please check the backend is running.'));
        dispatch(setLoading(false));
        es.close();
      };
    },
    [dispatch]
  );

  const cancelStream = useCallback(() => {
    esRef.current?.close();
    dispatch(setLoading(false));
  }, [dispatch]);

  return { sendQuestion, cancelStream };
}
