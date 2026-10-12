import { apiClient } from '@/lib/api';
import { askRequestSchema, askResponseSchema } from '../validators/ask.schema';
import type { ValidatedAskResponse } from '../validators/ask.schema';

export class AskService {
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
