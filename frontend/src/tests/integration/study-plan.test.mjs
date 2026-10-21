import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from './helpers/loadModule.mjs';

const session = {
  id: 'class-1', subject: 'Software Engineering', title: 'Foundations',
  dayOfWeek: 'Monday', sessionDate: '2030-02-04', startTime: '09:00', endTime: '10:30',
  timeSlot: '09:00 - 10:30', timeFormatted: '09:00 - 10:30', status: 'upcoming',
  planStartDate: '2030-01-31', planEndDate: '2030-03-30', weekNumber: 1,
  timezone: 'Asia/Karachi', sessionKind: 'lesson', subtopics: ['Requirements'], exercises: [],
};

test('weekly grouping retains free weeks, chronological classes and final partial week', () => {
  const { groupStudyPlanWeeks } = load('features/dashboard/utilities/studyPlanUtils.ts');
  const weeks = groupStudyPlanWeeks([session, { ...session, id: 'later', weekNumber: 9, sessionDate: '2030-03-28' }]);
  assert.equal(weeks.length, 9);
  assert.equal(weeks[1].items.length, 0);
  assert.equal(weeks[8].end, '2030-03-30');
  assert.equal(weeks[0].goals.join('|'), 'Software Engineering: Foundations');
  assert.equal(groupStudyPlanWeeks([{ ...session, planStartDate: undefined }]).length, 0);
});

test('weekly review shows topic scopes, practice, dates and independent study weeks', () => {
  const { StudyPlanWeeks } = load('features/dashboard/components/schedule/StudyPlanWeeks.tsx', { './ScheduleItemCard': { ScheduleItemCard: () => null } });
  const html = renderToStaticMarkup(createElement(StudyPlanWeeks, {
    items: [session, { ...session, id: 'practice', sessionKind: 'practice', exercises: ['Write a specification'] }],
  }));
  for (const text of ['Week 1', 'Week 9', '2030-02-04', 'Requirements', 'Write a specification', 'Practice', 'No classes scheduled this week']) assert.ok(html.includes(text), text);
  assert.ok(html.includes('attendance does not certify exercise completion'));
});

 test('dated requests include duration, start date and explicit selected study days', async () => {
  let payload;
  const { TimetableService } = load('services/timetableService.ts', {
    axios: { isAxiosError: () => false },
    '@/lib/api': { apiClient: { post: async (_url, data) => { payload = data; return { data: { id: 'job', status: 'queued' } }; } } },
  });
  await TimetableService.generate({ startDate: '2030-01-31', durationMonths: 3, studyDays: ['Saturday', 'Sunday'], preferredTime: 'morning', maxClassesPerDay: 2 }, 'Asia/Karachi');
  assert.equal(payload.start_date, '2030-01-31');
  assert.equal(payload.duration_months, 3);
  assert.equal(payload.days.join('|'), 'Saturday|Sunday');
});

test('dated classroom admission opens only on the actual saved date', () => {
  const { getScheduleAccess } = load('features/dashboard/utilities/scheduleAccess.ts');
  assert.equal(getScheduleAccess(session, 'UTC', new Date('2030-02-04T04:00:00Z')).canJoin, true);
  assert.equal(getScheduleAccess(session, 'UTC', new Date('2030-02-11T04:00:00Z')).canJoin, false);
  assert.equal(getScheduleAccess(session, 'UTC', new Date('2030-01-28T04:00:00Z')).canJoin, false);
});

test('class timetable requests select existing plans without sending a new duration or start date', async () => {
  let payload;
  const { TimetableService } = load('services/timetableService.ts', {
    axios: { isAxiosError: () => false },
    '@/lib/api': { apiClient: { post: async (_url, data) => { payload = data; return { data: { id: 'job', status: 'queued' } }; } } },
  });
  await TimetableService.generate({ useSavedPlans: true, courseIds: ['42'], studyDays: ['Tuesday'], preferredTime: 'morning', maxClassesPerDay: 2 }, 'Asia/Karachi');
  assert.equal(payload.use_saved_plans, true);
  assert.equal(payload.course_ids.join(','), '42');
  assert.equal('start_date' in payload, false);
  assert.equal('duration_months' in payload, false);
});

test('class course selector shows saved plans and disables courses without a plan', () => {
  const { TimetableCourseSelector } = load('features/dashboard/components/schedule/TimetableCourseSelector.tsx');
  const html = renderToStaticMarkup(createElement(TimetableCourseSelector, { selectedIds: ['1'], onToggle() {}, isLoading: false, hasError: false, courses: [
    { id: '1', title: 'Algorithms', courseCode: 'CS101', outlineTopics: ['Sorting'], outlinePeriod: { start_date: '2030-01-01', duration_months: 4 } },
    { id: '2', title: 'Unconfigured', courseCode: 'CS102', outlineTopics: [] },
  ] }));
  assert.match(html, /4-month saved plan/);
  assert.match(html, /disabled/);
  assert.match(html, /save this course/);
  assert.ok(!html.includes('type="date"'));
});
