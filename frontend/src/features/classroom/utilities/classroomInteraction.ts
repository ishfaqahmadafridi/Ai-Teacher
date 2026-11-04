import type { ClassroomInteractionState } from '../types/interaction.types';

export function classroomInteraction(state: ClassroomInteractionState) {
  const available = !state.loading && !state.isPlaying && !state.answerSubmitting &&
    (!state.classPhase || state.classPhase === 'live' || state.classPhase === 'self-study');
  const discussionOpen = state.pendingQuestion?.kind !== 'discussion' ||
    (!!state.pendingQuestion.expiresAt && Date.now() < state.pendingQuestion.expiresAt && !state.discussionExpired);
  const questionTurn = available && discussionOpen && !!state.pendingQuestion && !!state.noteId;
  // An empty self-study classroom still needs its initial topic request.
  const initialTopic = available && !state.scheduledSessionId && state.chunks.length === 0;
  return {
    questionTurn,
    questionKey: questionTurn ? JSON.stringify([state.noteId, state.pendingQuestion!.sectionIndex, state.pendingQuestion!.question]) : null,
    inputBlocked: !(questionTurn || initialTopic),
    micBlocked: !questionTurn,
  };
}
