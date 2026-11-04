import assert from 'node:assert/strict';
import test from 'node:test';
import { load } from './helpers/loadModule.mjs';

const { classroomInteraction } = load('features/classroom/utilities/classroomInteraction.ts');
const lesson = { chunks: [{ speak: 'Concept' }], noteId: 'note', loading: false, isPlaying: false,
  classPhase: 'live', scheduledSessionId: 'session', answerSubmitting: false, pendingQuestion: null };
const waiting = { ...lesson, pendingQuestion: { sectionIndex: 0, question: 'What happens next?' } };

test('typing and microphone open only for an active teacher question', () => {
  assert.equal(classroomInteraction(lesson).questionTurn, false);
  const open = classroomInteraction(waiting);
  assert.equal(open.questionTurn, true);
  assert.equal(open.inputBlocked, false);
  assert.equal(open.micBlocked, false);
  for (const change of [{ isPlaying: true }, { loading: true }, { answerSubmitting: true },
    { classPhase: 'waiting' }, { classPhase: 'checking' }, { classPhase: 'ended' }, { noteId: null }]) {
    const closed = classroomInteraction({ ...waiting, ...change });
    assert.equal(closed.questionTurn, false);
    assert.equal(closed.inputBlocked, true);
    assert.equal(closed.micBlocked, true);
  }
});

test('initial self-study topic typing remains available without opening voice', () => {
  const initial = classroomInteraction({ ...lesson, chunks: [], noteId: null,
    classPhase: 'self-study', scheduledSessionId: null });
  assert.equal(initial.inputBlocked, false);
  assert.equal(initial.questionTurn, false);
  assert.equal(initial.micBlocked, true);
});

test('each teacher question has its own interaction key', () => {
  assert.notEqual(classroomInteraction(waiting).questionKey,
    classroomInteraction({ ...waiting, pendingQuestion: { sectionIndex: 1, question: 'Next question?' } }).questionKey);
  assert.equal(classroomInteraction({ ...waiting, answerSubmitting: true }).questionKey, null);
});
