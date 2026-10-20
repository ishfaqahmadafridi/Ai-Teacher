import { readChatStream } from '../utilities/readChatStream';
import { CHAT_STREAM_ENDPOINT, CHAT_FIRST_TOKEN_TIMEOUT_MS, CHAT_TOKEN_IDLE_TIMEOUT_MS } from '../constants/chatStreamConstants';
import type { AskStreamOptions } from '../types/ask.types';
import { apiClient, refreshAccessToken } from '@/lib/api';
import { useAuthStore } from '@/features/auth/state/authStore';
import { askRequestSchema, askResponseSchema } from '../validators/ask.schema';
import type { ValidatedAskResponse } from '../validators/ask.schema';

export class AskService {
  /** Chat bypasses classroom lesson/research/visual jobs and renders tokens immediately. */
  static async streamQuestion({ question, sessionId, accessToken, signal, onToken }: AskStreamOptions): Promise<void> {
    askRequestSchema.parse({ question, session_id: sessionId });
    if (!accessToken) throw new Error('Please sign in before sending a message.');
    const controller = new AbortController();
    let timedOut = false;
    const abort = () => controller.abort();
    const expire = () => { timedOut = true; controller.abort(); };
    let timer = setTimeout(expire, CHAT_FIRST_TOKEN_TIMEOUT_MS);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) controller.abort();
    try {
      const accountId = useAuthStore.getState().user?.id;
      const submit = (token: string) => fetch(CHAT_STREAM_ENDPOINT, {
        method: 'POST', signal: controller.signal, credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question, session_id: sessionId }),
      });
      let response = await submit(accessToken);
      if (response.status === 401) {
        await response.body?.cancel();
        // Rotate once through the same guarded refresh used by normal API requests.
        const refreshed = await refreshAccessToken(accountId);
        if (signal.aborted || controller.signal.aborted) throw new Error('The request was cancelled.');
        response = await submit(refreshed);
      }
      if (!response.ok) {
        if (response.status === 401) throw new Error('The chat service could not verify your session. Please try again.');
        throw new Error('The chat service is unavailable. Please try again shortly.');
      }
      if (!response.body) throw new Error('The chat service returned an empty response.');
      await readChatStream(response.body, (token) => {
        clearTimeout(timer);
        timer = setTimeout(expire, CHAT_TOKEN_IDLE_TIMEOUT_MS);
        onToken(token);
      });
    } catch (error) {
      if (timedOut) throw new Error('The chat service took too long to respond. Please try again.');
      throw error;
    } finally {
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
    }
  }

  /**
   * Sends a follow-up textbook/concept question to the assistant.
   * Validates both input arguments and outputs against Zod schemas.
   */
  static async askQuestion(question: string, sessionId: string): Promise<ValidatedAskResponse> {
    // Validate request inputs before network calls
    const requestValidation = askRequestSchema.safeParse({ question, session_id: sessionId });
    if (!requestValidation.success) {
      throw new Error(requestValidation.error.issues[0].message);
    }

    const response = await apiClient.post('/api/physics-teacher/ask/', {
      question,
      session_id: sessionId,
    });

    return askResponseSchema.parse(response.data);
  }
}

export default AskService;
