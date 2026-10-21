import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from './helpers/loadModule.mjs';

test('course plan accepts old topic lists and preserves new detail and timetable data', () => {
  const { courseOutlineSchema } = load('features/dashboard/validators/courseOutline.schema.ts');
  const old = courseOutlineSchema.parse({ topics: ['Foundations'], source: 'manual', updated_at: null });
  assert.equal(old.details.length, 0);
  assert.equal(old.sessions.length, 0);
  const result = courseOutlineSchema.parse({ ...old,
    details: [{ title: 'Foundations', subtopics: ['Requirements'], exercises: ['Interview a stakeholder.'] }],
    sessions: [{ title: 'Foundations', day: 'Monday', date: '2026-10-26', start: '09:00', end: '10:30', timezone: 'Asia/Karachi' }],
  });
  assert.equal(result.details[0].exercises[0], 'Interview a stakeholder.');
  assert.equal(result.sessions[0].date, '2026-10-26');
});

test('topic cards show nested content, real planned dates, and unscheduled topics', () => {
  const { CourseOutlineTopicPlan } = load('features/dashboard/components/courses/CourseOutlineTopicPlan.tsx');
  const html = renderToStaticMarkup(createElement(CourseOutlineTopicPlan, {
    topics: ['Foundations', 'Testing'], disabled: false, onUpdate() {},
    details: [{ title: 'Foundations', subtopics: ['Requirements'], exercises: ['Interview a stakeholder.'] }],
    sessions: [{ title: 'Foundations', day: 'Monday', date: '2026-10-26', start: '09:00', end: '10:30', timezone: 'Asia/Karachi' }],
  }));
  assert.match(html, /Requirements/);
  assert.match(html, /Interview a stakeholder/);
  assert.match(html, /Monday, 2026-10-26/);
  assert.match(html, /09:00–10:30/);
  assert.match(html, /Not scheduled in the saved timetable/);
  assert.match(html, /not recorded completion/);
});
