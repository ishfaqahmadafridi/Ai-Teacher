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
