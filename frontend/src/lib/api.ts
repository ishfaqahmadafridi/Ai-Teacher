import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request Interceptor: Attach authentication token to headers if it exists
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling (e.g. clean up token on 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401 && typeof window !== 'undefined') {
        console.warn('Unauthorized! Logging out user...');
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);


// ─── SSE streaming helper ─────────────────────────────────────────────────────
export function createSSEStream(
  url: string,
  onMessage: (data: string) => void,
  onError: (err: Event) => void,
  onDone?: () => void
): EventSource {
  const fullUrl = `${BASE_URL}${url}`;
  const es = new EventSource(fullUrl, { withCredentials: true });

  es.onmessage = (e) => onMessage(e.data);
  es.onerror = (e) => {
    onError(e);
    es.close();
    onDone?.();
  };

  return es;
}

// ─── Ask endpoint ─────────────────────────────────────────────────────────────
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

// ─── Explain endpoint (SSE) ───────────────────────────────────────────────────
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
