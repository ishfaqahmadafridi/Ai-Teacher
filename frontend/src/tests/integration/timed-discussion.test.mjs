import assert from 'node:assert/strict';
import test from 'node:test';
import { load } from './helpers/loadModule.mjs';

const { classroomInteraction } = load('features/classroom/utilities/classroomInteraction.ts');
const base = { chunks: [{ speak: 'Concept' }], noteId: 'note', isPlaying: false, loading: false,
  classPhase: 'live', scheduledSessionId: 'session', pendingQuestion: { kind: 'discussion', sectionIndex: 1,
    question: 'Any concept questions?' } };

test('discussion controls stay closed until their server deadline is known, and close at expiry', () => {
  assert.equal(classroomInteraction(base).questionTurn, false);
  const pendingQuestion = { ...base.pendingQuestion, expiresAt: Date.now() + 30000 };
  assert.equal(classroomInteraction({ ...base, pendingQuestion }).questionTurn, true);
  assert.equal(classroomInteraction({ ...base, pendingQuestion, discussionExpired: true }).questionTurn, false);
  assert.equal(classroomInteraction({ ...base, pendingQuestion: { ...pendingQuestion, expiresAt: Date.now() - 1 } }).questionTurn, false);
});

function windowHarness(overrides = {}, raised = false) {
  const effects = [], actions = [], calls = [], timers = [];
  const classroom = { ...base, ...overrides };
  const { useDiscussionWindow } = load('features/classroom/hooks/useDiscussionWindow.ts', {
    react: { useEffect: effect => effects.push(effect), useRef: value => ({ current: value }) },
    '@/hooks/useAppStore': { useAppSelector: fn => fn({ classroom }), useAppDispatch: () => action => actions.push(action) },
    '../state/classroomSlice': new Proxy({}, { get: (_, type) => payload => ({ type, payload }) }),
    './useChunkPlayer': { useChunkPlayer: () => ({ playFrom: index => calls.push(['play', index]), stop: () => calls.push(['stop']), playReply: async text => calls.push(['invitation', text]) }) },
    '../services/lessonHandService': { lessonHandService: { read: async () => ({ hand_raised: raised, invitation: 'Ishfaq, what is your question about this concept?' }), set: async () => calls.push(['lower']) } },
    '../services/lessonProgressService': { lessonProgressService: {
      read: async () => ({ waiting: true, section_index: 1, server_now: '2026-11-05T00:00:00Z', discussion_expires_at: '2026-11-05T00:00:30Z' }),
      finish: async (...args) => calls.push(['save', ...args]),
    } },
  }, { AbortController, setTimeout: fn => { timers.push(fn); return 1; }, clearTimeout() {} });
  // eslint-disable-next-line react-hooks/rules-of-hooks -- isolated lifecycle harness
  useDiscussionWindow();
  effects.forEach(effect => effect());
  return { actions, calls, timers };
}

test('Q&A opens from the existing server deadline instead of starting a fresh timer', async () => {
  const h = windowHarness();
  await new Promise(resolve => setImmediate(resolve));
  const pending = h.actions.find(action => action.type === 'setPendingQuestion').payload;
  assert.equal(pending.kind, 'discussion');
  assert.ok(pending.expiresAt > Date.now());
});

test('a silent expired Q&A saves the next cursor and resumes without grading', async () => {
  const h = windowHarness({ pendingQuestion: { ...base.pendingQuestion, expiresAt: Date.now() - 1 }, discussionExpired: true });
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(h.calls.map(call => call.slice(0, 2)), [['stop'], ['save', 'note'], ['play', 2]]);
  assert.equal(h.actions.find(action => action.type === 'setPendingQuestion').payload, null);
});

test('expiry closes the student turn while allowing an already submitted teacher reply to finish', () => {
  const h = windowHarness({ pendingQuestion: { ...base.pendingQuestion, expiresAt: Date.now() - 1 }, discussionExpired: true, answerSubmitting: true });
  assert.equal(h.calls.length, 0);
});

 test('a raised hand is acknowledged by name before opening the concept question period', async () => {
  const h = windowHarness({}, true);
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(h.calls.map(call => call[0]), ['lower', 'invitation']);
  assert.match(h.calls[1][1], /^Ishfaq,/);
  assert.equal(h.actions.find(action => action.type === 'setHandRaised').payload, false);
  assert.ok(h.actions.find(action => action.type === 'setPendingQuestion').payload.expiresAt);
});
