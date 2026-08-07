import { BASE_URL } from './client';
import { createSSEStream } from './sse';

export const askQuestion = async (
  question: string,
  sessionId: string
): Promise<Response> => {
  const url = `${BASE_URL}/api/physics-teacher/ask/`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ question, session_id: sessionId }),
  });
};

export function explainTopic(
  question: string,
  sessionId: string,
  onChunk: (data: string) => void,
  onError: (e: Event) => void,
  onDone: () => void
): EventSource {
  const url = `/api/physics-teacher/explain/?question=${encodeURIComponent(question)}&session_id=${encodeURIComponent(sessionId)}`;
  return createSSEStream(url, onChunk, onError, onDone);
}
