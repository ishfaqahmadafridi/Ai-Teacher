import { useState, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  setLoading,
  setLoadingStatus,
  setError,
  setTopic,
  setDiagramType,
} from '../../redux/classroomSlice';
import type { TeachingResponse, DiagramType } from '../../types/classroom/classroom.types';

export function useClassroomApi() {
  const dispatch = useAppDispatch();

  const loading = useAppSelector(state => state.classroom.loading);
  const loadingStatus = useAppSelector(state => state.classroom.loadingStatus);
  const error = useAppSelector(state => state.classroom.error);
  const topic = useAppSelector(state => state.classroom.topic);
  const diagramType = useAppSelector(state => state.classroom.diagramType);

  const [history, setHistory] = useState<{ role: 'user' | 'prof'; text: string }[]>([]);
  const sseAbortRef = useRef<AbortController | null>(null);

  const fetchTeachingData = useCallback(async (
    question: string,
    onStart: () => void,
    onSuccess: (data: TeachingResponse) => void
  ) => {
    const q = question.trim();
    if (!q || loading) return;

    if (sseAbortRef.current) sseAbortRef.current.abort();

    dispatch(setError(null));
    dispatch(setLoading(true));
    dispatch(setLoadingStatus('Connecting to Prof. Gemini…'));
    onStart();

    setHistory(prev => [...prev, { role: 'user', text: q }]);

    try {
      const controller = new AbortController();
      sseAbortRef.current = controller;

      const response = await fetch('/api/physics-teacher/explain/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, language: 'en' }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Server error ${response.status}: ${response.statusText}`);
      if (!response.body) throw new Error('No response body received from server');

      dispatch(setLoadingStatus('Prof. Gemini is thinking…'));

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let teachingData: TeachingResponse | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const rawData = trimmed.slice(5).trim();
          if (rawData === '[DONE]') break;

          try {
            const parsed = JSON.parse(rawData);
            if (parsed.status === 'thinking') {
              dispatch(setLoadingStatus('Prof. Gemini is preparing your lesson…'));
            } else if (parsed.error) {
              throw new Error(parsed.error);
            } else if (parsed.result) {
              teachingData = parsed.result as TeachingResponse;
            }
          } catch {
            // Partial SSE line -- ignore
          }
        }
      }

      if (!teachingData) throw new Error('No teaching data received from Prof. Gemini');

      dispatch(setTopic(teachingData.topic ?? ''));
      dispatch(setDiagramType((teachingData.diagram_type ?? 'default') as DiagramType));

      const summary = teachingData.phases.map(p => p.speak).filter(Boolean).join(' ');
      setHistory(prev => [...prev, { role: 'prof', text: summary }]);

      onSuccess(teachingData);

    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      dispatch(setError(err?.message ?? 'Request failed. Please try again.'));
    } finally {
      dispatch(setLoading(false));
      dispatch(setLoadingStatus('Thinking…'));
      sseAbortRef.current = null;
    }
  }, [loading, dispatch]);

  const resetApiState = useCallback(() => {
    if (sseAbortRef.current) sseAbortRef.current.abort();
    setHistory([]);
    dispatch(setError(null));
    dispatch(setTopic(''));
    dispatch(setDiagramType('default'));
  }, [dispatch]);

  return {
    loading,
    loadingStatus,
    error,
    setError: (err: string | null) => dispatch(setError(err)),
    topic,
    setTopic: (t: string) => dispatch(setTopic(t)),
    diagramType,
    setDiagramType: (dt: DiagramType) => dispatch(setDiagramType(dt)),
    history,
    setHistory,
    fetchTeachingData,
    resetApiState,
  };
}
