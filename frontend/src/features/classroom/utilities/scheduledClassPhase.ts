import { scheduledSessionIdSchema } from '../validators/session.schema';
import { CLASSROOM_SESSION_QUERY_PARAM } from '../constants/sessionConstants';
import type { ClassPhase, TimedScheduledClass } from '../types/session.types';

/** Advance from server time using a monotonic clock, independent of the device timezone. */
export function scheduledClassPhase(session: TimedScheduledClass, now: number): ClassPhase {
  const serverTime = Date.parse(session.serverNow) + Math.max(0, now - session.receivedAt);
  if (serverTime >= Date.parse(session.endsAt)) return 'ended';
  return serverTime < Date.parse(session.startsAt) ? 'waiting' : 'live';
}

export function classroomSessionUrl(value?: string): string {
  const sessionId = scheduledSessionIdSchema.safeParse(value);
  return sessionId.success ? `/classroom?${CLASSROOM_SESSION_QUERY_PARAM}=${encodeURIComponent(sessionId.data)}` : '/classroom';
}
