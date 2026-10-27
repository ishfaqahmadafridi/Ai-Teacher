import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from './helpers/loadModule.mjs';

test('classroom header displays the current course without a Physics fallback', () => {
  const { LectureHeader } = load('features/classroom/components/sidebar/LectureHeader.tsx', {
    'next/image': { default: () => null, __esModule: true },
  });
  const html = renderToStaticMarkup(createElement(LectureHeader, { subject: 'Software Engineering', lectureTitle: 'Requirements' }));
  assert.ok(html.includes('Active • Software Engineering'));
  assert.ok(!html.includes('Physics'));
  const empty = renderToStaticMarkup(createElement(LectureHeader, {}));
  assert.ok(!empty.includes('Physics'));
  assert.ok(!empty.includes('Active •'));
});

test('course context survives lesson reset and can be cleared on leaving class', () => {
  const { default: reducer, setCourseTitle, resetClassroomState } = load('features/classroom/state/classroomSlice.ts');
  const state = reducer(undefined, setCourseTitle('Software Engineering'));
  const reset = reducer(state, resetClassroomState());
  assert.equal(reset.courseTitle, 'Software Engineering');
  assert.equal(reducer(reset, setCourseTitle('')).courseTitle, '');
});
