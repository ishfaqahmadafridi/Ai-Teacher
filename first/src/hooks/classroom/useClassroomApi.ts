import { useState, useRef, useCallback } from 'react';
import type { TeachingResponse } from '../../types/classroom/classroom.types';
import { type DiagramType } from '../../components/DiagramStage';

export function useClassroomApi() {
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Thinking…');
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [diagramType, setDiagramType] = useState<DiagramType>('default');
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

    setError(null);
    setLoading(true);
    setLoadingStatus('Connecting to Prof. Gemini…');
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

      setLoadingStatus('Prof. Gemini is thinking…');

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
              setLoadingStatus('Prof. Gemini is preparing your lesson…');
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

      setTopic(teachingData.topic ?? '');
      setDiagramType((teachingData.diagram_type ?? 'default') as DiagramType);
      
      const summary = teachingData.phases.map(p => p.speak).filter(Boolean).join(' ');
      setHistory(prev => [...prev, { role: 'prof', text: summary }]);

      onSuccess(teachingData);

    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      setError(err?.message ?? 'Request failed. Please try again.');
    } finally {
      setLoading(false);
      setLoadingStatus('Thinking…');
      sseAbortRef.current = null;
    }
  }, [loading]);

  const resetApiState = useCallback(() => {
    if (sseAbortRef.current) sseAbortRef.current.abort();
    setHistory([]);
    setError(null);
    setTopic('');
    setDiagramType('default');
  }, []);

  return {
    loading,
    loadingStatus,
    error,
    setError,
    topic,
    setTopic,
    diagramType,
    setDiagramType,
    history,
    setHistory,
    fetchTeachingData,
    resetApiState,
  };
}
