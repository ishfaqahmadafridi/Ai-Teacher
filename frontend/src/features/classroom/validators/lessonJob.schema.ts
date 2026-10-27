import { z } from 'zod';
export const lessonJobSchema = z.object({
  id: z.uuid(), status: z.enum(['queued', 'processing', 'ready', 'failed']),
  result: z.record(z.string(), z.unknown()), error: z.string(),
});

export const pendingLessonJobSchema = z.object({ id: z.uuid(), question: z.string(), scheduledSessionId: z.uuid().nullish() });
