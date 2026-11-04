import { z } from 'zod';
import { classroomAnswerSchema } from './classroom.schema';
export const lessonProgressSchema = z.object({ discussion_expires_at: z.iso.datetime({ offset: true }).nullable().optional(), server_now: z.iso.datetime({ offset: true }).optional(), section_index: z.number().int().nonnegative(), waiting: z.boolean(), revision: z.number().int().nonnegative(), question: z.string().nullable(), answer: classroomAnswerSchema });
const evaluationFeedbackSchema = z.object({ feedback: z.string().min(1), missing_concepts: z.array(z.string()) });
export const lessonEvaluationSchema = z.discriminatedUnion('outcome', [
  evaluationFeedbackSchema.extend({ outcome: z.literal('understood'), next_action: z.literal('continue') }),
  evaluationFeedbackSchema.extend({ outcome: z.literal('misconception'), next_action: z.literal('reteach') }),
  evaluationFeedbackSchema.extend({ outcome: z.literal('unclear'), next_action: z.literal('clarify') }),
]);
export const lessonAttemptSchema = z.object({ id: z.uuid() });

export const discussionReplySchema = z.object({ id: z.uuid(), reply: z.string().min(1).max(4000) });

export const lessonHandSchema = z.object({ hand_raised: z.boolean(), invitation: z.string().min(1) });
