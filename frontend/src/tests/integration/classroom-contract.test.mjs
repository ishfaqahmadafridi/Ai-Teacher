import assert from 'node:assert/strict';
import { test } from 'node:test';
import { load } from './helpers/loadModule.mjs';

const { classroomAnswerSchema, diagramCommandSchema } = load('features/classroom/validators/classroom.schema.ts');
const { DIAGRAM_ACTIONS } = load('features/classroom/constants/diagramConstants.ts');
const answer = action => ({ topic: 'Force', language: 'en', diagram_type: 'gravity',
  chunks: [{ speak: 'Gravity accelerates objects toward Earth.', diagram: { action, target: 'ball' } }] });

test('text animation speeds cannot introduce NaN into wave geometry', () => {
  let frame;
  let positions;
  const { WaveScene } = load('features/classroom/components/board/diagram/WaveScene.tsx', {
    react: {
      memo: component => component,
      useMemo: callback => callback(),
      useRef: value => ({ current: value === null ? { geometry: { setPositions: next => { positions = next; } } } : value }),
    },
    '@react-three/fiber': { useFrame: callback => { frame = callback; } },
    '@react-three/drei': { Line: 'line', Text: 'text' },
  });
  WaveScene({ command: { action: 'none', animate: { object: 'wave', move: 'oscillate', speed: 'slow' } } });
  frame({}, 0.016);
  assert.ok(positions.length > 0);
  assert.ok(positions.every(Number.isFinite));
});

test('stream validation preserves formulas, understanding checks and topic maps', () => {
  const { teachingResponseSchema } = load('features/classroom/validators/classroom.schema.ts');
  const response = teachingResponseSchema.parse({ topic: 'Ohm law', topic_map: ['Voltage'], phases: [{
    phase: 1, name: 'Example', speak: 'Calculate the current.', wait_for_answer: true,
    formulas: [{ line: 1, speak: 'Divide voltage by resistance.', display: 'I=V/R' }],
  }] });
  assert.equal(response.phases[0].wait_for_answer, true);
  assert.equal(response.phases[0].formulas[0].display, 'I=V/R');
  assert.equal(response.topic_map[0], 'Voltage');
});

for (const storage of [undefined, {
  getItem() { throw new Error('Storage denied'); },
  setItem() { throw new Error('Storage quota exceeded'); },
}]) {
  test(`active lesson storage tolerates ${storage ? 'access denial' : 'server rendering'}`, () => {
    const { readActiveLessonNote, saveActiveLessonNote } = load(
      'features/classroom/utilities/activeLessonStorage.ts', {}, { localStorage: storage },
    );
    assert.equal(readActiveLessonNote('student'), null);
    assert.doesNotThrow(() => saveActiveLessonNote('student', 'note'));
  });
}

test('active lesson recovery hints remain scoped to the signed-in account', () => {
  const saved = new Map();
  const { readActiveLessonNote, saveActiveLessonNote } = load(
    'features/classroom/utilities/activeLessonStorage.ts', {}, { localStorage: {
      getItem: key => saved.get(key) ?? null,
      setItem: (key, value) => saved.set(key, value),
    } },
  );
  saveActiveLessonNote('alice', 'alice-note');
  saveActiveLessonNote('bob', 'bob-note');
  assert.equal(readActiveLessonNote('alice'), 'alice-note');
  assert.equal(readActiveLessonNote('bob'), 'bob-note');
});

test('every supported playback action survives both classroom validators', () => {
  for (const action of DIAGRAM_ACTIONS) {
    assert.equal(classroomAnswerSchema.parse(answer(action)).chunks[0].diagram.action, action);
    assert.equal(diagramCommandSchema.parse({ action }).action, action);
  }
});

test('missing, null and unsupported visual actions preserve valid lesson narration', () => {
  for (const action of [undefined, null, '', 'invented_animation', {}, 42]) {
    const parsed = classroomAnswerSchema.parse(answer(action));
    assert.equal(parsed.chunks[0].diagram.action, 'none');
    assert.equal(parsed.chunks[0].diagram.target, 'ball');
    assert.equal(parsed.chunks[0].speak, answer(action).chunks[0].speak);
  }
});

test('visual recovery does not accept missing narration or an empty lesson', () => {
  assert.equal(classroomAnswerSchema.safeParse({ ...answer('none'), chunks: [] }).success, false);
  assert.equal(classroomAnswerSchema.safeParse({ ...answer('none'), chunks: [{ diagram: { action: 'bad' } }] }).success, false);
});

test('validation failures produce a bounded student message without schema internals', () => {
  const { classroomErrorMessage } = load('features/classroom/utilities/classroomErrors.ts', {}, { Error });
  const result = classroomAnswerSchema.safeParse({});
  const message = classroomErrorMessage(result.error, 'Failed');
  assert.match(message, /Please try again/);
  assert.ok(message.length < 150);
  assert.doesNotMatch(message, /invalid_value|chunks|expected|\[/);
  assert.equal(classroomErrorMessage(new Error('Your lesson is queued.'), 'Failed'), 'Your lesson is queued.');
  assert.equal(classroomErrorMessage(null, 'Failed'), 'Failed');
});
