import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/loadModule.mjs';

function answerHarness(nextAction, evaluationError = false, waiting = true) {
  const chunks = [{ speak: 'Example', question: 'Try it', expected_concepts: ['reasoning'] }, { speak: 'Next concept' }];
  const classroom = { chunks, noteId: 'note', pendingQuestion: waiting ? { sectionIndex: 0, question: 'Try it' } : null, inputText: 'My answer', currentChunkIndex: waiting ? 0 : 1 };
  const actions = [], played = [], calls = [];
  const { useInputBar } = load('features/classroom/hooks/useInputBar.ts', {
    react: { useEffect() {}, useCallback: fn => fn, useRef: current => ({ current }), useState: value => [value, () => {}] },
    '@/hooks/useAppStore': { useAppSelector: fn => fn({ classroom }), useAppDispatch: () => action => actions.push(action) },
    '@/features/classroom/state/classroomSlice': new Proxy({}, { get: (_, type) => payload => ({ type, payload }) }),
    './useVoiceInput': { useVoiceInput: () => ({ stopListening() {} }) },
    './useChunkPlayer': { useChunkPlayer: () => ({ stop() {}, playFrom: index => played.push(index) }) },
    './useClassroomApi': { useClassroomApi: () => ({ sendQuestion() { throw Error('An answer must not become a new lesson.'); } }) },
    '../services/lectureNotesService': { lectureNotesService: {
      answer: async (...args) => { calls.push(args); return { id: 'attempt' }; },
      evaluate: async () => {
        if (evaluationError) throw Error('Feedback unavailable');
        return { next_action: nextAction, feedback: 'Specific feedback', missing_concepts: [] };
      },
    } },
  }, { crypto: { randomUUID: () => 'request' }, AbortController });
  // eslint-disable-next-line react-hooks/rules-of-hooks -- isolated state harness
  return { bar: useInputBar(), classroom, actions, played, calls };
}

for (const action of ['continue', 'reteach', 'clarify']) {
  test(`checkpoint handles ${action} without discarding the lesson`, async () => {
    const h = answerHarness(action);
    await h.bar.handleSubmit();
    assert.equal(h.calls[0][1], 0);
    assert.equal(h.actions.some(item => item.type === 'setChunks'), false);
    assert.equal(h.classroom.chunks[1].speak, 'Next concept');
    assert.equal(h.actions.find(item => item.type === 'setCurrentChunkIndex').payload, action === 'continue' ? 1 : 0);
    const pending = h.actions.find(item => item.type === 'setPendingQuestion').payload;
    assert.equal(action === 'continue' ? pending : pending.question, action === 'continue' ? null : 'Try it');
    assert.equal(h.actions.find(item => item.type === 'setSpokenText').payload, 'Specific feedback');
  });
}

test('failed evaluation preserves the answer and pending check', async () => {
  const h = answerHarness('continue', true);
  await h.bar.handleSubmit();
  assert.equal(h.actions.some(item => item.type === 'setPendingQuestion'), false);
  assert.equal(h.actions.some(item => item.type === 'setInputText'), false);
});

test('play continues at the saved next step instead of restarting', () => {
  const h = answerHarness('continue', false, false);
  h.bar.handlePlayPause();
  assert.deepEqual(h.played, [1]);
});

for (const waiting of [false, true]) {
test(`recovery restores remaining chunks and ${waiting ? 'the visible question' : 'the saved position'}`, async () => {
  const effects = [], actions = [];
  const answer = { topic: 'Fractions', diagram_type: 'default', chunks: [{ speak: 'First' }, { speak: 'Next' }] };
  const { useLessonRecovery } = load('features/classroom/hooks/useLessonRecovery.ts', {
    react: { useEffect: fn => effects.push(fn) },
    '@/features/auth/state/authStore': { useAuthStore: fn => fn({ user: { id: 'student' } }) },
    '@/hooks/useAppStore': { useAppSelector: fn => fn({ classroom: { noteId: null } }), useAppDispatch: () => action => actions.push(action) },
    '../state/classroomSlice': new Proxy({}, { get: (_, type) => payload => ({ type, payload }) }),
    '../services/lessonProgressService': { lessonProgressService: { read: async () => ({ answer, section_index: 1, waiting, question: waiting ? 'Try again' : null }) } },
  }, { localStorage: { getItem: () => 'saved-note' }, AbortController });
  useLessonRecovery();
  const cleanup = effects[0]();
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(actions.find(item => item.type === 'setChunks').payload, answer.chunks);
  assert.equal(actions.find(item => item.type === 'setCurrentChunkIndex').payload, 1);
  assert.equal(JSON.stringify(actions.find(item => item.type === 'setChalkboardPoints').payload), JSON.stringify(waiting ? ['Try again'] : []));
  cleanup();
});
}

for (const waiting of [true, false]) {
  test(`restored lesson ${waiting ? 'waits for the answer' : 'plays from its saved position'}`, () => {
    const effects = [], played = [];
    const classroom = { chunks: [{ speak: 'First' }, { speak: 'Next' }], currentChunkIndex: 1, pendingQuestion: waiting ? { sectionIndex: 1, question: 'Try it' } : null };
    const { useClassroomLayout } = load('features/classroom/hooks/useClassroomLayout.ts', {
      react: { useEffect: fn => effects.push(fn) },
      './useLessonRecovery': { useLessonRecovery() {} },
      '@/hooks/useAppStore': { useAppSelector: fn => fn({ classroom }) },
      './useClassroomApi': { useClassroomApi: () => ({}) },
      './useChunkPlayer': { useChunkPlayer: () => ({ playFrom: index => played.push(index) }) },
    });
    useClassroomLayout();
    effects.forEach(effect => effect());
    assert.deepEqual(played, waiting ? [] : [1]);
  });
}

function submissionHarness(service) {
  const effects = [];
  const { useLessonAnswerSubmission } = load('features/classroom/hooks/useLessonAnswerSubmission.ts', {
    react: { useRef: current => ({ current }), useCallback: fn => fn, useEffect: fn => effects.push(fn) },
    '../services/lectureNotesService': { lectureNotesService: service },
  }, { AbortController, crypto: { randomUUID: () => 'stable-request' } });
  // eslint-disable-next-line react-hooks/rules-of-hooks -- isolated submission lifecycle
  const submit = useLessonAnswerSubmission('note');
  return { submit, cleanup: effects[0]() };
}

test('answer submission reuses its request ID when evaluation must be retried', async () => {
  const requests = [];
  let tries = 0;
  const h = submissionHarness({
    answer: async (...args) => { requests.push(args); return { id: 'attempt' }; },
    evaluate: async () => { if (++tries === 1) throw Error('Unavailable'); return { next_action: 'continue' }; },
  });
  const question = { sectionIndex: 1, question: 'Why?' };
  await assert.rejects(h.submit(question, 'Reason'), /Unavailable/);
  assert.equal((await h.submit(question, 'Reason')).next_action, 'continue');
  assert.equal(requests[0][3], requests[1][3]);
  h.cleanup();
});

test('leaving a lesson aborts its pending submission and prevents stale feedback', async () => {
  let finish, signal;
  const h = submissionHarness({
    answer: async (_id, _index, _answer, _request, activeSignal) => { signal = activeSignal; return { id: 'attempt' }; },
    evaluate: () => new Promise(resolve => { finish = resolve; }),
  });
  const result = h.submit({ sectionIndex: 0, question: 'Why?' }, 'Reason');
  await new Promise(resolve => setImmediate(resolve));
  h.cleanup();
  assert.equal(signal.aborted, true);
  finish({ next_action: 'continue' });
  await assert.rejects(result, { name: 'AbortError' });
});

test('failed answer submission does not request grading', async () => {
  let evaluations = 0;
  const h = submissionHarness({
    answer: async () => { throw Error('Save failed'); },
    evaluate: async () => { evaluations++; },
  });
  await assert.rejects(h.submit({ sectionIndex: 0, question: 'Why?' }, 'Reason'), /Save failed/);
  assert.equal(evaluations, 0);
  h.cleanup();
});

test('frontend feedback validation agrees with the backend outcome/action contract', () => {
  const { lessonEvaluationSchema } = load('features/classroom/validators/lesson.schema.ts');
  for (const [outcome, next_action] of [['understood', 'continue'], ['misconception', 'reteach'], ['unclear', 'clarify']]) {
    assert.equal(lessonEvaluationSchema.safeParse({ outcome, next_action, feedback: 'Explanation', missing_concepts: [] }).success, true);
  }
  assert.equal(lessonEvaluationSchema.safeParse({ outcome: 'misconception', next_action: 'continue', feedback: 'Explanation', missing_concepts: [] }).success, false);
});
