import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from './helpers/loadModule.mjs';

const windowData = {
  sessionId: '67ee4380-567d-4a86-8138-c29012248b7a',
  startsAt: '2026-11-04T10:00:00+05:00', endsAt: '2026-11-04T11:00:00+05:00',
  serverNow: '2026-11-04T09:59:00+05:00', receivedAt: 100,
};

test('server-clock boundaries start and end automatically, independent of the device timezone', () => {
  const { scheduledClassPhase } = load('features/classroom/utilities/scheduledClassPhase.ts');
  assert.equal(scheduledClassPhase(windowData, 100), 'waiting');
  assert.equal(scheduledClassPhase(windowData, 60099), 'waiting');
  assert.equal(scheduledClassPhase(windowData, 60100), 'live');
  assert.equal(scheduledClassPhase(windowData, 3660099), 'live');
  assert.equal(scheduledClassPhase(windowData, 3660100), 'ended');
});

test('input dock has no separate CC or playback section', () => {
  const { InputBar } = load('features/classroom/components/input/InputBar.tsx', {
    '../../hooks/useFullscreenInputDock': { useFullscreenInputDock: () => ({ current: null }) },
    './toolbar/InputBarToasts': { InputBarToasts: () => null },
    './toolbar/InputBarDockContainer': { InputBarDockContainer: () => createElement('div', { 'data-classroom-dock': true }) },
  });
  const html = renderToStaticMarkup(createElement(InputBar));
  assert.match(html, /data-classroom-dock/);
  assert.doesNotMatch(html, /subtitles-toggle-btn|play-pause-btn|stop-btn|Your teacher is waiting/);
});

function layoutHarness(phase, { noteId = null, completed = false, pending = false } = {}) {
  const effects = [], calls = [], actions = [], routes = [];
  const sessionId = phase === 'self-study' ? null : windowData.sessionId;
  const classroom = { classPhase: phase, scheduledSessionId: sessionId, chunks: completed ? [{ speak: 'Done' }] : [],
    currentChunkIndex: completed ? 1 : 0, isPlaying: false, pendingQuestion: pending ? { sectionIndex: 0 } : null };
  const { useClassroomLayout } = load('features/classroom/hooks/useClassroomLayout.ts', {
    react: { useEffect: fn => effects.push(fn), useRef: value => ({ current: value }) },
    'next/navigation': { useRouter: () => ({ replace: route => routes.push(route) }) },
    '@/hooks/useAppStore': { useAppSelector: fn => fn({ classroom }), useAppDispatch: () => action => actions.push(action) },
    '../state/classroomSlice': new Proxy({}, { get: (_, type) => payload => ({ type, payload }) }),
    './useScheduledClass': { useScheduledClass: () => ({ phase, sessionId, session: { ...windowData, noteId, lessonTitle: 'Ohm law' } }) },
    './useLessonRecovery': { useLessonRecovery() {} },
    './useRestoreLesson': { useRestoreLesson: () => async id => calls.push(['restore', id]) },
    './useClassroomApi': { useClassroomApi: () => ({ sendQuestion: async (...args) => calls.push(['ask', ...args]), cancelStream: () => calls.push(['cancel']) }) },
    './useChunkPlayer': { useChunkPlayer: () => ({ playFrom: index => calls.push(['play', index]), stop: () => calls.push(['stop']) }) },
  }, { AbortController });
  // eslint-disable-next-line react-hooks/rules-of-hooks -- isolated lifecycle harness
  useClassroomLayout();
  effects.forEach(effect => effect());
  return { calls, actions, routes };
}

test('early arrivals may prepare their lesson but cannot start narration before the server start time', () => {
  const waiting = layoutHarness('waiting');
  assert.equal(waiting.calls[0][0], 'ask');
  assert.equal(waiting.calls.some(call => call[0] === 'play'), false);
});

test('scheduled start requests the lesson automatically and refresh reuses an existing note', () => {
  const fresh = layoutHarness('live');
  assert.equal(fresh.calls[0][0], 'ask');
  assert.equal(fresh.calls[0][2], windowData.sessionId);
  assert.deepEqual(layoutHarness('live', { noteId: 'saved' }).calls, [['restore', 'saved']]);
});

test('scheduled end cancels preparation, stops audio, clears the class and returns to dashboard', () => {
  const ended = layoutHarness('ended');
  assert.deepEqual(ended.calls, [['cancel'], ['stop']]);
  assert.deepEqual(ended.routes, ['/dashboard']);
  assert.equal(ended.actions.find(action => action.type === 'setScheduledSessionId').payload, null);
});

test('a completed lesson does not autoplay from the beginning again', () => {
  assert.deepEqual(layoutHarness('self-study', { completed: true }).calls, []);
});


test('only dated session UUIDs enter the timed classroom route', () => {
  const { classroomSessionUrl } = load('features/classroom/utilities/scheduledClassPhase.ts');
  assert.equal(classroomSessionUrl(windowData.sessionId), `/classroom?session=${windowData.sessionId}`);
  assert.equal(classroomSessionUrl('123'), '/classroom');
  assert.equal(classroomSessionUrl(), '/classroom');
});
