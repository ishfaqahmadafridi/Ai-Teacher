import { z } from 'zod';

export const scheduledSessionIdSchema = z.uuid();

export const scheduledClassSchema = z.object({
  sessionId: scheduledSessionIdSchema, startsAt: z.iso.datetime({ offset: true }),
  endsAt: z.iso.datetime({ offset: true }), serverNow: z.iso.datetime({ offset: true }),
  courseTitle: z.string(), lessonTitle: z.string(), noteId: z.uuid().nullable(),
}).refine(value => Date.parse(value.startsAt) < Date.parse(value.endsAt), 'Invalid scheduled class window.');
