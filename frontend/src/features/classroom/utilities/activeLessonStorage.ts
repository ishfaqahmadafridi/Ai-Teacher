import { NOTE_ACTIVE_STORAGE_PREFIX } from '../constants/notesConstants';

/** Browser storage is a recovery hint; the authenticated API owns lesson progress. */
export function readActiveLessonNote(userId: string): string | null {
  try {
    return localStorage.getItem(`${NOTE_ACTIVE_STORAGE_PREFIX}${userId}`);
  } catch {
    return null;
  }
}

export function saveActiveLessonNote(userId: string, noteId: string): void {
  try {
    localStorage.setItem(`${NOTE_ACTIVE_STORAGE_PREFIX}${userId}`, noteId);
  } catch {
    // Storage denial must not prevent server-side progress from being saved.
  }
}
