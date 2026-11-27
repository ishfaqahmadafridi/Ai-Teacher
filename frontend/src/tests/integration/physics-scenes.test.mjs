import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/loadModule.mjs';

const scenes = load('features/classroom/utilities/physicsScenes.ts');
const constants = load('features/classroom/constants/physicsSceneConstants.ts');
const { ATOM_ORBITS } = load('features/classroom/constants/boardConstants.ts');
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
const closeAll = (actual, expected) => actual.forEach((value, index) => close(value, expected[index]));

test('scene speed maps lesson commands to each scene multiplier', () => {
  const { GRAVITY_SPEED, PROJECTILE_SPEED } = constants;
  assert.equal(scenes.sceneSpeed({ speed: 'fast' }, GRAVITY_SPEED), 1.5);
  assert.equal(scenes.sceneSpeed({ speed: 'slow' }, PROJECTILE_SPEED), 0.5);
  assert.equal(scenes.sceneSpeed(null, GRAVITY_SPEED), 1);
  assert.equal(scenes.sceneSpeed(null, PROJECTILE_SPEED), 0.9);
});

test('wave parameters use valid command numbers and fall back otherwise', () => {
  const defaults = { amplitude: 1.3, frequency: 2, speed: 2.5 };
  assert.deepEqual({ ...scenes.waveParameters(null, defaults) }, defaults);
  assert.deepEqual({ ...scenes.waveParameters({ animate: { amplitude: 0.5, frequency: 3, speed: 1 } }, defaults) },
    { amplitude: 0.5, frequency: 3, speed: 1 });
  assert.deepEqual({ ...scenes.waveParameters({ animate: { amplitude: Number.NaN, speed: Infinity } }, defaults) }, defaults);
});

test('one wave sampler matches the original first-frame and per-frame formulas', () => {
  const wave = { amplitude: 1.3, frequency: 2, speed: 2.5 };
  const [resolution, width, time] = [80, 8, 0.7];
  const points = scenes.wavePoints(resolution, width, wave, time * wave.speed);
  assert.equal(points.length, resolution);
  for (let i = 0; i < resolution; i++) {
    const x = -width / 2 + (i / (resolution - 1)) * width;
    closeAll(points[i], [x, Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude, 0]);
  }
  closeAll(scenes.wavePoints(resolution, width, wave)[10], [-4 + (10 / 79) * 8, Math.sin((-4 + (10 / 79) * 8) * 2) * 1.3, 0]);
});

test('free fall matches the original loop and stops at the ground', () => {
  for (const time of [0, 0.4, 1.2, 2.49, 3.1]) {
    const cycle = time % 2.5;
    close(scenes.freeFallHeight(time), Math.max(-2.2, 2.5 - 0.5 * 9.8 * cycle * cycle * 0.1));
  }
  assert.equal(scenes.freeFallTrail().length, 20);
  closeAll(scenes.freeFallTrail()[19], [0, 2.5 - 19 * 0.24, 0]);
});

test('projectile position, flight time and arc match the original 45 degree launch', () => {
  const vx = 8 * Math.cos(Math.PI / 4), vy = 8 * Math.sin(Math.PI / 4);
  close(scenes.PROJECTILE_FLIGHT_TIME, (2 * vy) / 9.8);
  closeAll(scenes.projectilePosition(0.5), [vx * 0.5 * 0.35 - 3, (vy * 0.5 - 0.5 * 9.8 * 0.25) * 0.35 - 2, 0]);
  const arc = scenes.projectileArc();
  assert.equal(arc.length, 60);
  closeAll(arc[0], [-3, -2, 0]);
  close(arc[59][1], -2);
});

test('electron orbit positions follow radius, speed and phase', () => {
  const orbit = ATOM_ORBITS[1];
  const angle = 2 * orbit.speed + orbit.phaseOffset;
  closeAll(scenes.orbitPosition(orbit, 2), [Math.cos(angle) * orbit.radius, Math.sin(angle) * orbit.radius, 0]);
});

test('dipole field lines match the original cubic Bezier construction', () => {
  const lines = scenes.dipoleFieldLines();
  assert.equal(lines.length, 12);
  assert.equal(lines[0].length, 31);
  const angle = (3 / 12) * Math.PI * 2, t = 0.4, u = 1 - t;
  const p = [[-1.8, 0], [-1.8 + Math.cos(angle) * 1.5, Math.sin(angle) * 1.5],
    [1.8 - Math.cos(angle) * 1.5, Math.sin(angle) * 1.5], [1.8, 0]];
  const expected = [0, 1].map(axis => u ** 3 * p[0][axis] + 3 * u * u * t * p[1][axis] + 3 * u * t * t * p[2][axis] + t ** 3 * p[3][axis]);
  closeAll(lines[3][12], [...expected, 0]);
  closeAll(lines[3][0], [-1.8, 0, 0]);
  closeAll(lines[3][30], [1.8, 0, 0]);
});

test('scene constants keep a shared title style and complete speed tables', () => {
  assert.deepEqual([...constants.SCENE_TITLE.position], [0, -3.2, 0]);
  for (const table of [constants.GRAVITY_SPEED, constants.PROJECTILE_SPEED]) {
    for (const key of ['slow', 'normal', 'fast']) assert.equal(typeof table[key], 'number');
  }
});
