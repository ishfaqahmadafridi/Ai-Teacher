import { z } from 'zod';
export const lessonProgressSchema = z.object({ section_index: z.number().int().nonnegative(), waiting: z.boolean(), revision: z.number().int().nonnegative(), question: z.string().nullable() });
export const lessonEvaluationSchema = z.object({ outcome: z.enum(['understood', 'misconception', 'unclear']), feedback: z.string().min(1), missing_concepts: z.array(z.string()), next_action: z.enum(['continue', 'reteach', 'clarify']) });
export const lessonAttemptSchema = z.object({ id: z.uuid() });
