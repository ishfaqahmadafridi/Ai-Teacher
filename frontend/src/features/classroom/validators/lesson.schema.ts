import { z } from 'zod';
import { classroomAnswerSchema } from './classroom.schema';
export const lessonProgressSchema = z.object({ section_index: z.number().int().nonnegative(), waiting: z.boolean(), revision: z.number().int().nonnegative(), question: z.string().nullable(), answer: classroomAnswerSchema });
const evaluationFeedbackSchema = z.object({ feedback: z.string().min(1), missing_concepts: z.array(z.string()) });
export const lessonEvaluationSchema = z.discriminatedUnion('outcome', [
  evaluationFeedbackSchema.extend({ outcome: z.literal('understood'), next_action: z.literal('continue') }),
  evaluationFeedbackSchema.extend({ outcome: z.literal('misconception'), next_action: z.literal('reteach') }),
  evaluationFeedbackSchema.extend({ outcome: z.literal('unclear'), next_action: z.literal('clarify') }),
]);
export const lessonAttemptSchema = z.object({ id: z.uuid() });
