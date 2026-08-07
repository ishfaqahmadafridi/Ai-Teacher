import { BASE_URL } from './client';

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
