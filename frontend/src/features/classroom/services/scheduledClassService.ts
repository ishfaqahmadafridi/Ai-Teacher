import { apiClient } from '@/lib/api';
import { scheduledClassSchema } from '../validators/session.schema';

export const scheduledClassService = {
  async read(sessionId: string, signal?: AbortSignal) {
    const response = await apiClient.get<unknown>(`/api/dashboard/timetable/sessions/${sessionId}/join/`, { signal });
    return { ...scheduledClassSchema.parse(response.data), receivedAt: performance.now() };
  },
};
