import { pendingLessonJobSchema } from '../validators/lessonJob.schema';
import { LESSON_PENDING_STORAGE_PREFIX } from '../constants/lessonJobConstants';
const key = (sessionId: string) => `${LESSON_PENDING_STORAGE_PREFIX}${sessionId}`;
export function readPendingLessonJob(sessionId: string) {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const result = pendingLessonJobSchema.safeParse(JSON.parse(sessionStorage.getItem(key(sessionId)) || 'null'));
    return result.success ? result.data : null;
  } catch { return null; }
}
export function savePendingLessonJob(sessionId: string, id: string, question: string, scheduledSessionId?: string | null) {
  try { sessionStorage.setItem(key(sessionId), JSON.stringify({ id, question, scheduledSessionId })); } catch { /* Storage is optional. */ }
}
export function clearPendingLessonJob(sessionId: string) {
  try { sessionStorage.removeItem(key(sessionId)); } catch { /* Storage is optional. */ }
}
