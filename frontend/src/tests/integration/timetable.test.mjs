import assert from 'node:assert/strict';
import { test } from 'node:test';
import { load } from './helpers/loadModule.mjs';

test('timetable requests send custom availability and leave registered course ownership to the backend', async () => {
  let payload;
  const { TimetableService } = load('services/timetableService.ts', {
    axios: { isAxiosError: () => false },
    '@/lib/api': { apiClient: { post: async (url, data) => { payload = { url, data }; return { data: { id: 'job', status: 'queued' } }; } } },
  });
  const result = await TimetableService.generate({ preferredTime: 'custom', customStartTime: '13:15', customEndTime: '16:45', maxClassesPerDay: 2, includeSaturday: true, registeredCourses: ['Untrusted course'] }, 'Asia/Karachi');
  assert.equal(result.status, 'queued');
  assert.equal(payload.url, '/api/dashboard/timetable/generate/');
  assert.equal(payload.data.start_time, '13:15');
  assert.equal(payload.data.end_time, '16:45');
  assert.equal(payload.data.timezone, 'Asia/Karachi');
  assert.ok(payload.data.days.includes('Saturday'));
  assert.equal('registeredCourses' in payload.data, false);
});

test('weekly matrix uses actual persisted slots including custom evening times', () => {
  const { getScheduleTimeSlots, findScheduleItemBySlotAndDay } = load('features/dashboard/utilities/scheduleUtils.ts');
  const items = [
    { id: 'evening', dayOfWeek: 'Sunday', startTime: '19:00', timeSlot: '19:00 - 20:30', timeFormatted: '19:00 - 20:30' },
    { id: 'morning', dayOfWeek: 'Monday', startTime: '09:00', timeSlot: '09:00 - 10:30', timeFormatted: '09:00 - 10:30' },
    { id: 'repeat', dayOfWeek: 'Tuesday', startTime: '09:00', timeSlot: '09:00 - 10:30' },
  ];
  const slots = getScheduleTimeSlots(items);
  assert.equal(slots.join('|'), '09:00 - 10:30|19:00 - 20:30');
  assert.equal(findScheduleItemBySlotAndDay(items, slots[1], 'Sunday').id, 'evening');
  assert.equal(getScheduleTimeSlots([]).length, 0);
});

test('scheduled Join respects timezone, exact boundaries, reminder window and completed sessions', () => {
  const { getScheduleAccess } = load('features/dashboard/utilities/scheduleAccess.ts');
  const item = { id: 'session', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:30', timeFormatted: '09:00 - 10:30', status: 'upcoming', timezone: 'Asia/Karachi' };
  const at = (iso, changes = {}) => getScheduleAccess({ ...item, ...changes }, 'UTC', new Date(iso));
  assert.equal(at('2026-10-12T03:54:59Z').startsSoon, false);
  assert.equal(at('2026-10-12T03:57:00Z').startsSoon, true);
  assert.equal(at('2026-10-12T03:59:59Z').canJoin, true);
  assert.equal(at('2026-10-12T04:00:00Z').canJoin, true);
  assert.equal(at('2026-10-12T05:29:59Z').canJoin, false);
  assert.equal(at('2026-10-12T05:30:00Z').canJoin, false);
  assert.equal(at('2026-10-13T04:00:00Z', { status: 'live' }).canJoin, false);
  assert.equal(at('2026-10-12T04:00:00Z', { status: 'completed' }).canJoin, false);
  assert.equal(at('2026-10-12T04:00:00Z', { startTime: 'invalid' }).canJoin, false);
});

test('legacy twelve-hour sessions respect daylight-saving time', () => {
  const { getScheduleAccess } = load('features/dashboard/utilities/scheduleAccess.ts');
  const item = { id: 'legacy', dayOfWeek: 'Monday', timeSlot: '09:00 AM - 10:30 AM', status: 'upcoming' };
  assert.equal(getScheduleAccess(item, 'America/New_York', new Date('2026-07-06T13:00:00Z')).canJoin, true);
  assert.equal(getScheduleAccess(item, 'America/New_York', new Date('2026-01-05T14:00:00Z')).canJoin, true);
});

test('day selection follows the timetable timezone and resets manual selection after midnight', () => {
  let now = Date.parse('2026-10-08T18:30:00Z');
  let state = null;
  const { useScheduleSelectedDay: evaluateDaySelection } = load('features/dashboard/hooks/useScheduleSelectedDay.ts', {
    react: { useState: () => [state, next => { state = next; }] },
    './useScheduleClock': { useScheduleClock: () => now },
  });
  const today = () => evaluateDaySelection('Asia/Karachi');
  assert.equal(today().selectedDay, 'Thursday');
  today().setSelectedDay('Monday');
  assert.equal(today().selectedDay, 'Monday');
  now = Date.parse('2026-10-08T19:00:00Z');
  assert.equal(today().selectedDay, 'Friday');
});

test('display times identify AM and PM without changing saved wall-clock values', () => {
  const { formatScheduleTimeSlot, formatScheduleTime } = load('features/dashboard/utilities/scheduleTimeFormat.ts');
  assert.equal(formatScheduleTimeSlot('11:00 - 12:30'), '11:00 AM – 12:30 PM');
  assert.equal(formatScheduleTimeSlot('19:00 - 20:30'), '07:00 PM – 08:30 PM');
  assert.equal(formatScheduleTime('00:00'), '12:00 AM');
  assert.equal(formatScheduleTime('12:00'), '12:00 PM');
  assert.equal(formatScheduleTimeSlot('09:00 AM - 10:30 AM'), '09:00 AM – 10:30 AM');
});

test('Pakistan evening session closes at 11 PM instead of using an American timezone', () => {
  const { getScheduleAccess } = load('features/dashboard/utilities/scheduleAccess.ts');
  const item = { id: 'evening', dayOfWeek: 'Thursday', startTime: '21:00', endTime: '23:00', timezone: 'Asia/Karachi', timeFormatted: '21:00 - 23:00', status: 'upcoming' };
  assert.equal(getScheduleAccess(item, 'America/New_York', new Date('2026-10-08T17:59:59Z')).canJoin, false);
  const after = getScheduleAccess(item, 'America/New_York', new Date('2026-10-08T18:01:00Z'));
  assert.equal(after.canJoin, false);
  assert.equal(after.ended, true);
});

test('10 AM class opens at 9:57, admits through 10:10 and blocks late entry', () => {
  const { getScheduleAccess } = load('features/dashboard/utilities/scheduleAccess.ts');
  const item = { id: 'window', dayOfWeek: 'Monday', startTime: '10:00', endTime: '11:30', timeFormatted: '10:00 - 11:30', status: 'upcoming', timezone: 'Asia/Karachi' };
  const at = iso => getScheduleAccess(item, 'UTC', new Date(iso));
  assert.equal(at('2026-10-12T04:56:59Z').canJoin, false);
  assert.equal(at('2026-10-12T04:57:00Z').canJoin, true);
  assert.equal(at('2026-10-12T05:10:00Z').canJoin, true);
  assert.equal(at('2026-10-12T05:10:00.001Z').canJoin, false);
  assert.equal(at('2026-10-12T05:10:00.001Z').isLate, true);
  assert.equal(at('2026-10-12T06:30:00Z').isLate, false);
  assert.equal(at('2026-10-12T06:30:00Z').ended, true);
  assert.equal(at('2026-10-12T04:57:00Z').joinOpensAt, '09:57 AM');
  assert.equal(at('2026-10-12T04:57:00Z').joinClosesAt, '10:10 AM');
});

test('early admission crosses midnight and the Sunday/Monday boundary', () => {
  const { getScheduleAccess } = load('features/dashboard/utilities/scheduleAccess.ts');
  const item = { id: 'midnight', dayOfWeek: 'Monday', startTime: '00:00', endTime: '01:00', timeFormatted: '00:00 - 01:00', status: 'upcoming', timezone: 'UTC' };
  assert.equal(getScheduleAccess(item, 'UTC', new Date('2026-10-11T23:56:59Z')).canJoin, false);
  assert.equal(getScheduleAccess(item, 'UTC', new Date('2026-10-11T23:57:00Z')).canJoin, true);
  assert.equal(getScheduleAccess({ ...item, sessionDate: '2026-10-12' }, 'UTC', new Date('2026-10-11T23:57:00Z')).canJoin, true);
  assert.equal(getScheduleAccess({ ...item, sessionEnded: true }, 'UTC', new Date('2026-10-12T00:00:00Z')).canJoin, false);
});

test('class availability includes breaks and validates the entire daily class count', () => {
  const { timetableAvailabilityError } = load('features/dashboard/utilities/timetablePreferencesUtils.ts');
  assert.equal(timetableAvailabilityError({ preferredTime: 'morning', maxClassesPerDay: 2 }), null);
  assert.match(timetableAvailabilityError({ preferredTime: 'morning', maxClassesPerDay: 3 }), /330 minutes/);
  assert.ok(timetableAvailabilityError({ preferredTime: 'afternoon', maxClassesPerDay: 2 }));
  assert.equal(timetableAvailabilityError({ preferredTime: 'afternoon', maxClassesPerDay: 1 }), null);
  assert.equal(timetableAvailabilityError({ preferredTime: 'custom', customStartTime: '09:00', customEndTime: '14:30', maxClassesPerDay: 3 }), null);
  assert.ok(timetableAvailabilityError({ preferredTime: 'custom', customStartTime: 'bad', customEndTime: '14:30', maxClassesPerDay: 2 }));
});

test('saved plan requests cannot override saved duration with stale form values', () => {
  const { buildTimetableRequest } = load('features/dashboard/utilities/timetablePreferencesUtils.ts');
  const request = buildTimetableRequest({ useSavedPlans: true, courseIds: ['1'], startDate: '2030-01-01', durationMonths: 4, preferredTime: 'morning', maxClassesPerDay: 2 }, 'Asia/Karachi');
  assert.equal('start_date' in request, false);
  assert.equal('duration_months' in request, false);
});
