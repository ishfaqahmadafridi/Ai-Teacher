import { z } from 'zod';

export const askRequestSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty'),
  session_id: z.string().uuid('Session ID must be a valid UUID'),
});

export const askResponseSchema = z.object({
  answer: z.string().min(1, 'Response answer cannot be empty'),
});

export type ValidatedAskRequest = z.infer<typeof askRequestSchema>;
export type ValidatedAskResponse = z.infer<typeof askResponseSchema>;
