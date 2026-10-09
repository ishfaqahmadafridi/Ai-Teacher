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

function playbackHarness() {
  const state = { chunks: [{ speak: 'First step' }, { speak: 'Second step' }], voices: [], selectedVoice: '', isPaused: false };
  const dispatched = [], spoken = [], effects = [];
  const actions = new Proxy({}, { get: (_, name) => value => ({ type: name, payload: value }) });
  const { useChunkPlayer } = load('features/classroom/hooks/useChunkPlayer.ts', {
    react: { useCallback: fn => fn, useRef: value => ({ current: value }), useEffect: fn => effects.push(fn) },
    '@/hooks/useAppStore': { useAppDispatch: () => action => dispatched.push(action), useAppSelector: fn => fn({ classroom: state }) },
    '@/features/classroom/state/classroomSlice': actions,
  }, {
    window: { speechSynthesis: { cancel() {}, speak: utterance => spoken.push(utterance), getVoices: () => [] } },
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
  });
  const player = useChunkPlayer();
  effects.forEach(fn => fn());
  return { player, spoken, dispatched };
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
