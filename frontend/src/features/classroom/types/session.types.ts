import type { z } from 'zod';
import type { scheduledClassSchema } from '../validators/session.schema';

export type ClassPhase = 'self-study' | 'checking' | 'waiting' | 'live' | 'ended';
export type ScheduledClass = z.infer<typeof scheduledClassSchema>;
export type TimedScheduledClass = ScheduledClass & { receivedAt: number };
