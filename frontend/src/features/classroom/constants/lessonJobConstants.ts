/** Bounded, jittered polling avoids synchronized requests from many classrooms. */
export const LESSON_JOB_POLL_MS = 2000;
export const LESSON_JOB_POLL_JITTER_MS = 1000;
export const LESSON_JOB_WAIT_MS = 600000;
export const LESSON_PENDING_STORAGE_PREFIX = 'classroom_pending_lesson:';
