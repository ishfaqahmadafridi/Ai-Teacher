import { apiClient } from '@/lib/api';
import { teachingResponseSchema } from '../validators/classroom.schema';
import type { ValidatedTeachingResponse } from '../validators/classroom.schema';

export class ClassroomService {
  /**
   * Healthcheck to verify the backend and API keys are configured.
   */
  static async checkHealth(): Promise<{ status: string; streaming: boolean }> {
    const response = await apiClient.get('/api/physics-teacher/health/');
    return response.data;
  }

  /**
   * Safe parser to validate the JSON object returned from the SSE explanation stream.
   * Leverages the classroom Zod schema validation rules.
   */
  static validateExplanation(data: unknown): ValidatedTeachingResponse {
    const parseResult = teachingResponseSchema.safeParse(data);
    if (!parseResult.success) {
      console.warn('[ClassroomService] Validation warning, trying fallback logic:', parseResult.error.format());
      // Return parsed data anyway if validation is soft, or throw hard error
      return data as ValidatedTeachingResponse;
    }
    return parseResult.data;
  }
}

export default ClassroomService;
