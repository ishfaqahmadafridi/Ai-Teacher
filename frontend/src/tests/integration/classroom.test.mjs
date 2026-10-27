import assert from 'node:assert/strict';
import { test } from 'node:test';
import { load } from './helpers/loadModule.mjs';

test('classroom response parsing preserves diagram metadata and rejects malformed chunks', () => {
  const { classroomAnswerSchema } = load('features/classroom/validators/classroom.schema.ts');
  const response = classroomAnswerSchema.parse({
    chunks: [{ speak: 'Force has magnitude and direction.', diagram: { action: 'none', enabled: true, type: 'diagram' } }],
    topic: 'Force', language: 'en', diagram_type: 'vector_force',
  });
  assert.equal(response.chunks[0].diagram.enabled, true);
  assert.equal(response.diagram_type, 'default');
  assert.equal(classroomAnswerSchema.safeParse({ chunks: 'bad' }).success, false);
});

test('native emoji picker keeps reaction callbacks and removes its element on cleanup', async () => {
  let effect;
  let selected;
  let removed = false;
  let options;
  const element = { remove: () => { removed = true; } };
  const container = { appendChild: child => assert.equal(child, element) };
  const { useEmojiReactionPicker } = load('features/classroom/hooks/useEmojiReactionPicker.ts', {
    react: { useRef: () => ({ current: container }), useEffect: callback => { effect = callback; } },
    '@emoji-mart/data': {},
    '../constants/inputConstants': { EMOJI_PICKER_OPTIONS: { theme: 'dark', perLine: 7 } },
    'emoji-mart': { Picker: class { constructor(input) { options = input; return element; } } },
  });
  useEmojiReactionPicker(true, (emoji, name) => { selected = [emoji, name]; });
  const cleanup = effect();
  await new Promise(resolve => setImmediate(resolve));
  options.onEmojiSelect({ native: '😀', name: 'Grinning' });
  assert.deepEqual(selected, ['😀', 'Grinning']);
  assert.equal(options.perLine, 7);
  cleanup();
  assert.equal(removed, true);
});

test('closing the emoji picker during lazy loading does not append a detached picker', async () => {
  let effect;
  let mounted = 0;
  const { useEmojiReactionPicker } = load('features/classroom/hooks/useEmojiReactionPicker.ts', {
    react: { useRef: () => ({ current: { appendChild: () => { mounted++; } } }), useEffect: callback => { effect = callback; } },
    '@emoji-mart/data': {},
    '../constants/inputConstants': { EMOJI_PICKER_OPTIONS: {} },
    'emoji-mart': { Picker: class {} },
  });
  useEmojiReactionPicker(true, () => {});
  effect()();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(mounted, 0);
});

function dismissalHarness(open = true) {
  let effect;
  let closed = 0;
  const surface = {};
  const listeners = new Map();
  const document = {
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name, fn) => { assert.equal(listeners.get(name), fn); listeners.delete(name); },
  };
  const { useClassroomDismiss } = load('features/classroom/hooks/useClassroomDismiss.ts', {
    react: { useRef: () => ({ current: surface }), useEffect: fn => { effect = fn; } },
  }, { document });
  // eslint-disable-next-line react-hooks/rules-of-hooks -- test harness intentionally invokes hook directly
  useClassroomDismiss(open, () => { closed += 1; });
  return { surface, listeners, cleanup: effect(), closed: () => closed };
}

test('classroom surfaces dismiss outside clicks but preserve internal shadow-DOM interactions', () => {
  const h = dismissalHarness();
  h.listeners.get('pointerdown')({ composedPath: () => [{}, h.surface] });
  assert.equal(h.closed(), 0);
  h.listeners.get('pointerdown')({ composedPath: () => [{}] });
  assert.equal(h.closed(), 1);
  h.cleanup();
  assert.equal(h.listeners.size, 0);
});

test('Escape dismisses classroom surfaces while normal typing does not', () => {
  const h = dismissalHarness();
  h.listeners.get('keydown')({ key: 'a' });
  assert.equal(h.closed(), 0);
  h.listeners.get('keydown')({ key: 'Escape' });
  assert.equal(h.closed(), 1);
  h.cleanup();
});

test('closed classroom surfaces install no dismissal listeners', () => {
  const h = dismissalHarness(false);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.cleanup, undefined);
});

function playbackHarness(question, availableVoices = [{ voiceURI: 'test-local', lang: 'en-US', localService: true, default: true }], noteId = null) {
  const state = { noteId, chunks: [{ speak: 'First step', key_point: 'First point', question }, { speak: 'Second step' }], voices: [], selectedVoice: '', isPaused: false };
  const dispatched = [], spoken = [], effects = [], timers = [], files = [];
  const actions = new Proxy({}, { get: (_, name) => value => ({ type: name, payload: value }) });
  const { useChunkPlaybackOwner: useChunkPlayer } = load('features/classroom/hooks/useChunkPlaybackOwner.ts', {
    react: { useCallback: fn => fn, useRef: value => ({ current: value }), useEffect: fn => effects.push(fn) },
    './useLessonAudioPlayer': { useLessonAudioPlayer: () => ({ playAudio: (...args) => files.push(args), stopAudio() {}, pauseAudio() {}, resumeAudio() {} }) },
    '@/hooks/useAppStore': { useAppDispatch: () => action => dispatched.push(action), useAppSelector: fn => fn({ classroom: state }) },
    '@/features/classroom/state/classroomSlice': actions,
    '../constants/playbackConstants': load('features/classroom/constants/playbackConstants.ts'),
    '../utilities/speechVoiceSelection': load('features/classroom/utilities/speechVoiceSelection.ts'),
  }, {
    window: { speechSynthesis: { cancel() {}, resume() {}, speak: utterance => spoken.push(utterance), getVoices: () => availableVoices } },
    document: { documentElement: { lang: 'en' } },
    navigator: { language: 'en-US', userActivation: { hasBeenActive: true } },
    setTimeout: callback => { timers.push(callback); return timers.length; }, clearTimeout() {},
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks -- test harness intentionally invokes hook directly
  const player = useChunkPlayer();
  effects.forEach(fn => fn());
  return { player, spoken, dispatched, timers, files };
}

test('AI answers play sequential steps and finish after the final step', () => {
  const h = playbackHarness();
  h.player.play();
  assert.deepEqual(h.spoken.map(u => u.text), ['First step']);
  h.spoken[0].onend();
  assert.deepEqual(h.spoken.map(u => u.text), ['First step', 'Second step']);
  h.spoken[1].onend();
  assert.equal(h.dispatched.at(-2).type, 'setIsPlaying');
  assert.equal(h.dispatched.at(-2).payload, false);
});

test('stopped answers ignore delayed speech events', () => {
  const h = playbackHarness();
  h.player.play();
  const old = h.spoken[0];
  h.player.stop();
  old.onend();
  old.onerror({ error: 'network' });
  assert.equal(h.spoken.length, 1);
});

test('canceled speech does not skip to another answer step', () => {
  const h = playbackHarness();
  h.player.play();
  h.spoken[0].onerror({ error: 'canceled' });
  assert.equal(h.spoken.length, 1);
});

test('rendered classroom stage invokes the playback-owning layout hook', () => {
  let calls = 0;
  const result = { chunks: [{ speak: 'Voltage equals current times resistance.' }], isPlaying: true };
  const { useClassroomStageArea } = load('features/classroom/hooks/useClassroomStageArea.ts', {
    './useLectureFigureCapture': { useLectureFigureCapture: () => {} },
    './useClassroomLayout': { useClassroomLayout: () => { calls += 1; return result; } },
  });
  assert.equal(useClassroomStageArea(), result);
  assert.equal(calls, 1);
});


test('speech failure stops playback and reports the reason without skipping steps', () => {
  const h = playbackHarness();
  h.player.play();
  h.spoken[0].onerror({ error: 'not-allowed' });
  assert.equal(h.spoken.length, 1);
  assert.equal(h.dispatched.at(-1).type, 'setVoiceError');
  assert.match(h.dispatched.at(-1).payload, /not-allowed/);
  assert.ok(h.dispatched.some(action => action.type === 'setIsPlaying' && action.payload === false));
});

test('board points appear only when narration starts', () => {
  const h = playbackHarness();
  h.player.play();
  assert.equal(h.dispatched.filter(action => action.type === 'addChalkboardPoint').length, 0);
  h.spoken[0].onstart();
  assert.equal(h.dispatched.filter(action => action.type === 'addChalkboardPoint').length, 1);
});


test('understanding checks stop playback and preserve the pending question', () => {
  const h = playbackHarness('What happens next?');
  h.player.play();
  h.spoken[0].onend();
  assert.equal(h.spoken.length, 1);
  const pending = h.dispatched.find(action => action.type === 'setPendingQuestion');
  assert.equal(pending.payload.sectionIndex, 0);
  assert.equal(pending.payload.question, 'What happens next?');
  assert.equal(h.dispatched.at(-1).payload, false);
});


test('playback consumers share the provider controls', () => {
  const controls = { play() {}, pause() {}, resume() {}, stop() {} };
  const { useChunkPlayer } = load('features/classroom/hooks/useChunkPlayer.ts', {
    react: { useContext: () => controls },
    '../context/ClassroomPlaybackContext': { ClassroomPlaybackContext: {} },
  });
  assert.equal(useChunkPlayer(), controls);
  assert.equal(useChunkPlayer(), controls);
});


test('mounted classroom stage connects the actual playback lifecycle', () => {
  let calls = 0;
  const component = () => null;
  const { ClassroomStageArea } = load('features/classroom/components/stage/ClassroomStageArea.tsx', {
    react: { memo: fn => fn },
    '../../hooks/useClassroomStageArea': { useClassroomStageArea: () => { calls += 1; } },
    './ClassroomStageGrid': { ClassroomStageGrid: component },
    './StageOverlayGroup': { StageOverlayGroup: component },
    './SubtitleBar': { SubtitleBar: component },
  });
  ClassroomStageArea();
  assert.equal(calls, 1);
});


test('silent speech startup times out and reveals the explanation without skipping', () => {
  const h = playbackHarness();
  h.player.play();
  h.timers[0]();
  assert.equal(h.spoken.length, 1);
  assert.equal(h.dispatched.at(-1).type, 'setVoiceError');
  assert.match(h.dispatched.at(-1).payload, /did not start/);
  assert.ok(h.dispatched.some(action => action.type === 'addChalkboardPoint' && action.payload === 'First step'));
  h.spoken[0].onend();
  assert.equal(h.spoken.length, 1);
});


test('speech explicitly uses an installed local voice and full volume', () => {
  const h = playbackHarness();
  h.player.play();
  assert.equal(h.spoken[0].voice.voiceURI, 'test-local');
  assert.equal(h.spoken[0].lang, 'en-US');
  assert.equal(h.spoken[0].volume, 1);
});

test('missing system voices produce an actionable error instead of an indefinite wait', () => {
  const h = playbackHarness(undefined, []);
  h.player.play();
  assert.equal(h.spoken.length, 0);
  assert.match(h.dispatched.at(-1).payload, /No speech voices/);
});


test('voice selection excludes a stalled voice and preserves the requested language', () => {
  const { selectSpeechVoice } = load('features/classroom/utilities/speechVoiceSelection.ts');
  const broken = { voiceURI: 'broken', lang: 'en-GB', default: true, localService: true };
  const working = { voiceURI: 'working', lang: 'en-US', default: false, localService: true };
  assert.equal(selectSpeechVoice([broken, working], 'broken', new Set(['broken']), 'en'), working);
});


test('retry after a stalled voice lets the browser choose its default speech voice', () => {
  const h = playbackHarness();
  h.player.play();
  h.timers[0]();
  h.player.play();
  assert.equal(h.spoken.length, 2);
  assert.equal(h.spoken[1].voice, undefined);
});


function speechDiagnosticHarness() {
  const spoken = [], statuses = [], timers = [];
  const { useSpeechDiagnostic } = load('features/classroom/hooks/useSpeechDiagnostic.ts', {
    react: { useCallback: fn => fn, useRef: value => ({ current: value }), useState: () => [null, value => statuses.push(value)], useEffect() {} },
    './useChunkPlayer': { useChunkPlayer: () => ({ stop() {} }) },
    '../constants/playbackConstants': load('features/classroom/constants/playbackConstants.ts'),
  }, {
    window: { speechSynthesis: { resume() {}, cancel() {}, speak: utterance => spoken.push(utterance), speaking: false, pending: true, paused: false } },
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
    setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout() {},
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks -- invokes the hook in a controlled test harness
  return { diagnostic: useSpeechDiagnostic(), spoken, statuses, timers };
}

test('isolated audio test speaks directly with no named voice or API dependency', () => {
  const h = speechDiagnosticHarness();
  h.diagnostic.testAudio();
  assert.equal(h.spoken.length, 1);
  assert.equal(h.spoken[0].voice, undefined);
  h.spoken[0].onstart();
  assert.match(h.statuses.at(-1), /Speech started/);
});

test('isolated speech timeout reports the actual queue state', () => {
  const h = speechDiagnosticHarness();
  h.diagnostic.testAudio();
  h.timers[0]();
  assert.match(h.statuses.at(-1), /pending=true/);
  h.spoken[0].onend();
  assert.match(h.statuses.at(-1), /stalled/);
});


test('stalled browser speech switches to private saved audio and continues sequentially', () => {
  const h = playbackHarness(undefined, undefined, 'saved-note');
  h.player.play();
  h.timers[0]();
  assert.equal(h.files.length, 1);
  assert.equal(h.files[0][0], 'saved-note');
  assert.equal(h.files[0][1], 0);
  assert.equal(h.files[0][2], 'First step');
  h.files[0][3].onStart();
  assert.equal(h.dispatched.at(-3).type, 'addChalkboardPoint');
  h.files[0][3].onEnd();
  assert.equal(h.files.length, 2);
  assert.equal(h.files[1][1], 1);
});


test('classroom service rejects malformed explanations instead of casting them', () => {
  const schemas = load('features/classroom/validators/classroom.schema.ts');
  const { ClassroomService } = load('features/classroom/services/classroomService.ts', {
    '@/lib/api': { apiClient: {} }, '../validators/classroom.schema': schemas,
  });
  assert.throws(() => ClassroomService.validateExplanation({ topic: 'Broken', phases: 'invalid' }));
});


test('formulas remain visible without a specialized 3D scene', () => {
  const { useStageDiagramGrid } = load('features/classroom/hooks/useStageDiagramGrid.ts', {
    '@/hooks/useAppStore': { useAppSelector: fn => fn({ classroom: { diagramType: 'default', currentCommand: { action: 'show_formula' }, currentFormula: 'F = ma' } }) },
    '@/utils/imageUtils': { isImageUrl: () => false },
  });
  assert.equal(useStageDiagramGrid().hasVisual, true);
});


test('circuit visual parameters are retained and zero resistance is rejected', () => {
  const { classroomAnswerSchema } = load('features/classroom/validators/classroom.schema.ts');
  const answer = { topic: 'Ohms law', language: 'en', diagram_type: 'circuit', chunks: [{ speak: 'Example', diagram: { action: 'show_initial', parameters: { voltage: 12, resistance: 4 } } }] };
  assert.equal(classroomAnswerSchema.parse(answer).chunks[0].diagram.parameters.voltage, 12);
  answer.chunks[0].diagram.parameters.resistance = 0;
  assert.equal(classroomAnswerSchema.safeParse(answer).success, false);
});

test('classroom questions explicitly enable the research tools', async () => {
  let payload;
  const schemas = load('features/classroom/validators/classroom.schema.ts');
  const { ClassroomService } = load('features/classroom/services/classroomService.ts', {
    '@/lib/api': { apiClient: { post: async (_url, body) => {
      payload = body;
      return { data: { id: '00000000-0000-4000-8000-000000000001', status: 'ready', error: '', result: { chunks: [{ speak: 'Explanation', diagram: { action: 'none' } }], topic: 'Heart', language: 'en', diagram_type: 'default' } } };
    } } }, '../validators/classroom.schema': schemas,
  }, { crypto: { randomUUID: () => '00000000-0000-4000-8000-000000000002' } });
  await ClassroomService.askQuestion({ question: 'Explain the heart', sessionId: 'session' });
  assert.equal(payload.research, true);
});

test('queued lesson polling updates status and returns the prepared response', async () => {
  const statuses = [];
  const schemas = load('features/classroom/validators/classroom.schema.ts');
  const { ClassroomService } = load('features/classroom/services/classroomService.ts', {
    '@/lib/api': { apiClient: {
      post: async () => ({ data: { id: '00000000-0000-4000-8000-000000000001', status: 'queued', error: '', result: {} } }),
      get: async () => ({ data: { id: '00000000-0000-4000-8000-000000000001', status: 'ready', error: '', result: { chunks: [{ speak: 'Prepared explanation' }], topic: 'Heart', language: 'en', diagram_type: 'default' } } }),
    } },
    '../validators/classroom.schema': schemas,
    '../utilities/waitForLessonJob': { waitForLessonJob: async () => {} },
  }, { crypto: { randomUUID: () => '00000000-0000-4000-8000-000000000002' } });
  const answer = await ClassroomService.askQuestion({ question: 'Heart', sessionId: 'session', onStatus: status => statuses.push(status) });
  assert.equal(answer.topic, 'Heart');
  assert.match(statuses[0], /Submitting/);
  assert.match(statuses[1], /queued/);
});

test('pending lesson recovery reuses the owned job instead of submitting again', async () => {
  let submissions = 0;
  const records = new Map([['classroom_pending_lesson:session', JSON.stringify({ id: '00000000-0000-4000-8000-000000000001', question: 'Heart' })]]);
  const schemas = load('features/classroom/validators/classroom.schema.ts');
  const { ClassroomService } = load('features/classroom/services/classroomService.ts', {
    '@/lib/api': { apiClient: {
      post: async () => { submissions++; throw new Error('Unexpected new request'); },
      get: async () => ({ data: { id: '00000000-0000-4000-8000-000000000001', status: 'ready', error: '', result: { chunks: [{ speak: 'Prepared' }], topic: 'Heart', language: 'en', diagram_type: 'default' } } }),
    } }, '../validators/classroom.schema': schemas,
  }, { sessionStorage: { getItem: key => records.get(key), setItem: (key, value) => records.set(key, value), removeItem: key => records.delete(key) } });
  const answer = await ClassroomService.askQuestion({ question: 'Heart', sessionId: 'session' });
  assert.equal(answer.topic, 'Heart');
  assert.equal(submissions, 0);
  assert.equal(records.size, 0);
});

test('deleted pending jobs are replaced instead of trapping recovery', async () => {
  let submissions = 0;
  const records = new Map([['classroom_pending_lesson:session', JSON.stringify({ id: '00000000-0000-4000-8000-000000000001', question: 'Heart' })]]);
  const schemas = load('features/classroom/validators/classroom.schema.ts');
  const { ClassroomService } = load('features/classroom/services/classroomService.ts', {
    '@/lib/api': { apiClient: {
      get: async () => { throw { isAxiosError: true, response: { status: 404 } }; },
      post: async () => { submissions++; return { data: { id: '00000000-0000-4000-8000-000000000002', status: 'ready', error: '', result: { chunks: [{ speak: 'Prepared' }], topic: 'Heart', language: 'en', diagram_type: 'default' } } }; },
    } }, '../validators/classroom.schema': schemas,
  }, { crypto: { randomUUID: () => '00000000-0000-4000-8000-000000000003' }, sessionStorage: { getItem: key => records.get(key), setItem: (key, value) => records.set(key, value), removeItem: key => records.delete(key) } });
  const answer = await ClassroomService.askQuestion({ question: 'Heart', sessionId: 'session' });
  assert.equal(answer.topic, 'Heart');
  assert.equal(submissions, 1);
  assert.equal(records.size, 0);
});

test('polynomial visual samples the actual equation and places the zero axis correctly', () => {
  const { visualGeometry } = load('features/classroom/utilities/structuredVisual.ts');
  const graph = visualGeometry({ kind: 'polynomial', coefficients: [0, 0, 1], x_min: -3, x_max: 3 });
  assert.equal(graph.axisX, 300);
  assert.match(graph.path, /^M40,40 /);
  assert.ok(graph.path.includes('L300,340'));
  assert.equal(visualGeometry({ kind: 'polynomial', coefficients: [0, 1], x_min: 1, x_max: 3 }).axisX, null);
});

function recoveryHarness(recoverPending = false) {
  const effects = [], actions = [], requests = [];
  const actionCreators = new Proxy({}, { get: (_, type) => payload => ({ type, payload }) });
  const { useClassroomApi } = load('features/classroom/hooks/useClassroomApi.ts', {
    react: { useRef: value => ({ current: value }), useCallback: fn => fn, useEffect: fn => effects.push(fn) },
    './useClassroomQueries': { useClassroomQuestionMutation: () => ({ mutateAsync: request => new Promise((resolve, reject) => { requests.push(request); request.signal.addEventListener('abort', () => reject(new Error('aborted'))); }) }) },
    '@/shared/hooks/useConversationSession': { useConversationSession: () => () => 'session' },
    '@/hooks/useAppStore': { useAppDispatch: () => action => actions.push(action), useAppSelector: selector => selector({ classroom: {} }) },
    '@/features/classroom/state/classroomSlice': actionCreators,
    '../utilities/pendingLessonJob': { readPendingLessonJob: () => ({ question: 'Gravity' }) },
  }, { AbortController });
  // eslint-disable-next-line react-hooks/rules-of-hooks -- isolated hook lifecycle harness
  useClassroomApi({ recoverPending });
  return { effects, actions, requests };
}

test('classroom consumers do not independently resume the pending lesson', () => {
  const h = recoveryHarness();
  h.effects.forEach(effect => effect());
  assert.equal(h.requests.length, 0);
});

test('classroom owner resumes after Strict Mode cleanup and clears cancelled loading', async () => {
  const h = recoveryHarness(true);
  const cleanup = h.effects[0]();
  h.effects[1]();
  assert.equal(h.requests.length, 1);
  cleanup();
  assert.equal(h.requests[0].signal.aborted, true);
  assert.ok(h.actions.some(action => action.type === 'setLoading' && action.payload === false));
  const secondCleanup = h.effects[0]();
  h.effects[1]();
  assert.equal(h.requests.length, 2);
  assert.equal(h.requests[1].signal.aborted, false);
  secondCleanup();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.actions.filter(action => action.type === 'setError').length, 0);
});

test('an offline lesson queue stops the spinner but preserves the recoverable job', async () => {
  let now = 0, submissions = 0;
  const records = new Map();
  const job = { id: '00000000-0000-4000-8000-000000000001', status: 'queued', error: '', result: {} };
  const { ClassroomService } = load('features/classroom/services/classroomService.ts', {
    '@/lib/api': { apiClient: {
      post: async () => { submissions++; return { data: job }; },
      get: async () => ({ data: job }),
    } },
    '../utilities/waitForLessonJob': { waitForLessonJob: async () => { now += 46000; } },
  }, {
    Date: { now: () => now }, crypto: { randomUUID: () => job.id },
    sessionStorage: { getItem: key => records.get(key), setItem: (key, value) => records.set(key, value), removeItem: key => records.delete(key) },
  });
  await assert.rejects(ClassroomService.askQuestion({ question: 'Gravity', sessionId: 'session' }), /worker may be offline/);
  assert.equal(submissions, 1);
  assert.equal(records.size, 1);
  await assert.rejects(ClassroomService.askQuestion({ question: 'Gravity', sessionId: 'session' }), /worker may be offline/);
  assert.equal(submissions, 1);
});
