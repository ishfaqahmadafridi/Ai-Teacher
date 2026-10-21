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

test('course outline retains period and its weekly breakdown in the API contract', () => {
  const { courseOutlineSchema } = load('features/dashboard/validators/courseOutline.schema.ts');
  const plan = courseOutlineSchema.parse({ topics: ['Foundations'], details: [], source: 'manual', updated_at: null,
    period: { start_date: '2030-01-01', duration_months: 4 },
    weeks: [{ number: 1, start: '2030-01-01', end: '2030-01-07', items: [{ title: 'Foundations', subtopics: ['Requirements'], exercises: ['Write a specification'], activity: 'Lesson' }] }],
  });
  assert.equal(plan.period.duration_months, 4);
  assert.equal(plan.weeks[0].items[0].subtopics[0], 'Requirements');
});

test('course weekly outline shows week numbers and planned topic work without date ranges', () => {
  const { CourseOutlineWeeks } = load('features/dashboard/components/courses/CourseOutlineWeeks.tsx');
  const html = renderToStaticMarkup(createElement(CourseOutlineWeeks, { weeks: [
    { number: 1, start: '2030-01-01', end: '2030-01-07', items: [{ title: 'Foundations', subtopics: ['Requirements'], exercises: ['Write a specification'], activity: 'Lesson' }] },
    { number: 2, start: '2030-01-08', end: '2030-01-14', items: [{ title: 'Foundations', subtopics: [], exercises: [], activity: 'Review' }] },
  ] }));
  for (const text of ['Your course in 2 weeks', 'Week 1', 'Week 2', 'Requirements', 'Write a specification', 'Review', 'not a record of completed work']) assert.ok(html.includes(text), text);
  assert.ok(!html.includes('2030-01-14'));
  assert.ok(!html.includes('2030-01-01'));
});

test('AI outline request sends chosen study period before drafting', async () => {
  let request;
  const { courseOutlineService } = load('features/dashboard/services/courseOutlineService.ts', {
    '@/lib/api': { apiClient: { post: async (url, body) => { request = { url, body }; return { data: { topics: ['Foundations'], source: 'ai', updated_at: null } }; } } },
  });
  await courseOutlineService.generate('42', undefined, { start_date: '2030-01-01', duration_months: 4 });
  assert.equal(request.body.period.duration_months, 4);
  assert.equal(request.body.period.start_date, '2030-01-01');
});

test('course study plan opens as a separate table with course name, duration and course selector', () => {
  const { CourseStudyPlanModal } = load('features/dashboard/components/courses/CourseStudyPlanModal.tsx', {
    '../modals/DashboardDialog': { DashboardDialog: ({ children }) => createElement('div', null, children) },
    '../../hooks/useCourseStudyPlan': { useCourseStudyPlan: () => ({
      courseId: '1', setCourseId() {}, course: { title: 'Software Engineering', courseCode: 'CS307' },
      isLoading: false, error: false,
      outline: { period: { start_date: '2030-01-01', duration_months: 4 }, weeks: [
        { number: 1, start: '2030-01-01', end: '2030-01-07', items: [{ title: 'Foundations', subtopics: ['Requirements'], exercises: ['Write a specification'], activity: 'Lesson' }] },
      ] },
    }) },
  });
  const html = renderToStaticMarkup(createElement(CourseStudyPlanModal, { courses: [
    { id: '1', title: 'Software Engineering', courseCode: 'CS307' },
    { id: '2', title: 'Algorithms', courseCode: 'CS201' },
  ], onClose() {} }));
  for (const text of ['Software Engineering', 'Selected plan: 4 months', 'Topic name', 'Subtopics and exercises', 'Week 1', 'Write a specification', 'Algorithms']) assert.ok(html.includes(text), text);
  assert.match(html, /<table/);
  assert.match(html, /<select/);
});

test('weekly table lists each week once and merges lesson and practice fragments by topic', () => {
  const { CourseOutlineWeeks } = load('features/dashboard/components/courses/CourseOutlineWeeks.tsx');
  const html = renderToStaticMarkup(createElement(CourseOutlineWeeks, { weeks: [
    { number: 9, start: '2030-02-26', end: '2030-03-04', items: [
      { title: 'Design', subtopics: ['Interfaces'], exercises: [], activity: 'Lesson' },
      { title: 'Design', subtopics: ['Interfaces', 'Patterns'], exercises: [], activity: 'Lesson' },
      { title: 'Design', subtopics: [], exercises: ['Build a prototype'], activity: 'Practice' },
      { title: 'Testing', subtopics: ['Unit tests'], exercises: [], activity: 'Lesson' },
    ] },
  ] }));
  assert.equal((html.match(/Week 9/g) ?? []).length, 1);
  assert.equal((html.match(/>Design</g) ?? []).length, 1);
  assert.equal((html.match(/<li[^>]*>Interfaces</g) ?? []).length, 1);
  assert.match(html, /rowSpan="2"/i);
  for (const text of ['Patterns', 'Build a prototype', 'Unit tests', 'Lesson · Practice']) assert.ok(html.includes(text), text);
});

test('course table places assignments after their exercises and quiz within the same week group', () => {
  const { CourseOutlineWeeks } = load('features/dashboard/components/courses/CourseOutlineWeeks.tsx');
  const html = renderToStaticMarkup(createElement(CourseOutlineWeeks, { weeks: [
    { number: 2, start: '2030-01-08', end: '2030-01-14', quiz: { number: 1, title: 'Quiz 1', topics: ['Design'] }, items: [
      { title: 'Design', subtopics: [], exercises: ['Build a prototype'], assignments: [{ exercise: 'Build a prototype', instruction: 'Submit the prototype and explain your approach.' }], activity: 'Practice' },
    ] },
  ] }));
  for (const text of ['Assignment:', 'Submit the prototype', 'Quiz 1', 'Quiz coverage', 'Planned assessment']) assert.ok(html.includes(text), text);
  assert.ok(html.indexOf('Build a prototype') < html.indexOf('Assignment:'));
  assert.equal((html.match(/Week 2/g) ?? []).length, 1);
  assert.match(html, /rowSpan="2"/i);
});
