import type { ClassroomState } from './classroom.types';

export type ClassroomInteractionState = Pick<ClassroomState,
  'pendingQuestion' | 'noteId' | 'loading' | 'isPlaying' | 'classPhase' |
  'chunks' | 'scheduledSessionId' | 'answerSubmitting' | 'discussionExpired'>;
