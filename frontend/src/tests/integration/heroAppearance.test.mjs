import assert from 'node:assert/strict';
import { test } from 'node:test';
import { load } from './helpers/loadModule.mjs';

const { getHeroAppearance } = load('features/dashboard/utilities/heroAppearance.ts');

test('hero switches at exact local day, sunset and night boundaries', () => {
  const at = (time) => getHeroAppearance(new Date(`2026-10-20T${time}Z`), 'Asia/Karachi');
  assert.equal(at('00:59:59').period, 'night');
  assert.equal(at('01:00:00').period, 'day');
  assert.equal(at('01:00:00').greeting, 'Good Morning');
  assert.equal(at('07:00:00').greeting, 'Good Afternoon');
  assert.equal(at('11:59:59').period, 'day');
  assert.equal(at('12:00:00').period, 'sunset');
  assert.equal(at('12:00:00').greeting, 'Good Evening');
  assert.equal(at('14:59:59').period, 'sunset');
  assert.equal(at('15:00:00').period, 'night');
  assert.equal(at('15:00:00').imageSrc, '/images/student_study_foreground.png');
});

test('hero follows profile timezone rather than the same instant in another country', () => {
  const date = new Date('2026-10-20T13:00:00Z');
  assert.equal(getHeroAppearance(date, 'Asia/Karachi').period, 'sunset');
  assert.equal(getHeroAppearance(date, 'America/Los_Angeles').period, 'day');
  assert.equal(getHeroAppearance(date, 'Asia/Tokyo').period, 'night');
});

test('missing or invalid timezone safely uses browser-local time', () => {
  const date = new Date('2026-10-20T13:00:00Z');
  assert.deepEqual(getHeroAppearance(date, 'invalid/timezone'), getHeroAppearance(date));
});

test('one foreground stays fixed while lighting and sun position progress continuously', () => {
  const at = (time) => getHeroAppearance(new Date(`2026-10-20T${time}Z`), 'UTC');
  assert.equal(at('08:00:00').imageSrc, at('22:00:00').imageSrc);
  assert.equal(at('06:00:00').sceneStyle['--hero-day'], 0.5);
  assert.equal(at('17:00:00').sceneStyle['--hero-sunset'], 0.5);
  assert.equal(at('19:00:00').sceneStyle['--hero-night'], 0.5);
  assert.notEqual(at('09:00:00').sceneStyle['--hero-sun-x'], at('15:00:00').sceneStyle['--hero-sun-x']);
  assert.ok(Math.abs(at('16:59:59').sceneStyle['--hero-sunset'] - at('17:00:00').sceneStyle['--hero-sunset']) < 0.001);
  for (const time of ['00:00:00', '06:30:00', '17:15:00', '19:30:00', '23:59:59']) {
    const s = at(time).sceneStyle;
    assert.ok(Math.abs(s['--hero-day'] + s['--hero-sunset'] + s['--hero-night'] - 1) < 0.00001);
  }
});
