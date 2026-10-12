import { apiClient } from '@/lib/api';
import type { ClassroomAnswer, ClassroomQuestion, ClassroomHealth } from '../types/api.types';
import { classroomAnswerSchema, teachingResponseSchema } from '../validators/classroom.schema';
import type { ValidatedTeachingResponse } from '../validators/classroom.schema';

export class ClassroomService {
  static async askQuestion({ question, sessionId, signal }: ClassroomQuestion): Promise<ClassroomAnswer> {
    const response = await apiClient.post<unknown>('/api/ask/', { question, session_id: sessionId }, { signal, timeout: 120_000 });
    return classroomAnswerSchema.parse(response.data);
  }

  /**
   * Healthcheck to verify the backend and API keys are configured.
   */
  static async checkHealth(signal?: AbortSignal): Promise<ClassroomHealth> {
    const response = await apiClient.get<ClassroomHealth>('/api/health/', { signal });
    return response.data;
  }

  /**
   * Safe parser to validate the JSON object returned from the SSE explanation stream.
   * Leverages the classroom Zod schema validation rules.
   */
  static validateExplanation(data: unknown): ValidatedTeachingResponse {
    return teachingResponseSchema.parse(data);
  }
}

export default ClassroomService;
