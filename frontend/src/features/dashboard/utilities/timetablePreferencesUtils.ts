import { TIMETABLE_TIME_WINDOWS, TIMETABLE_SESSION_MINUTES, TIMETABLE_BREAK_MINUTES } from '../constants/timetableConstants';
import { DEFAULT_STUDY_PLAN_DAYS } from '../constants/studyPlanConstants';
import { getScheduleTimeMinutes } from './scheduleTimeFormat';
import type { StudentSchedulePreferences } from '../types/timetablePreferences.types';

export function timetableTimeWindow(preferences: Pick<StudentSchedulePreferences, 'preferredTime' | 'customStartTime' | 'customEndTime'>) {
  return preferences.preferredTime === 'custom'
    ? [preferences.customStartTime ?? '', preferences.customEndTime ?? '']
    : TIMETABLE_TIME_WINDOWS[preferences.preferredTime];
}

export function timetableAvailabilityError(preferences: Pick<StudentSchedulePreferences, 'preferredTime' | 'customStartTime' | 'customEndTime' | 'maxClassesPerDay'>): string | null {
  const [start, end] = timetableTimeWindow(preferences).map(getScheduleTimeMinutes);
  const required = preferences.maxClassesPerDay * TIMETABLE_SESSION_MINUTES + (preferences.maxClassesPerDay - 1) * TIMETABLE_BREAK_MINUTES;
  if (start === null || end === null || end - start < required) {
    return `These hours must fit ${preferences.maxClassesPerDay} classes and breaks (${required} minutes). Choose longer Custom hours or fewer classes.`;
  }
  return null;
}

export function buildTimetableRequest(preferences: StudentSchedulePreferences, timezone: string) {
  const [start, end] = timetableTimeWindow(preferences);
  return {
    ...(preferences.useSavedPlans ? { use_saved_plans: true, course_ids: preferences.courseIds?.map(Number) } : preferences.startDate ? { start_date: preferences.startDate, duration_months: preferences.durationMonths } : {}),
    start_time: start, end_time: end,
    days: preferences.studyDays ?? [...DEFAULT_STUDY_PLAN_DAYS, ...(preferences.includeSaturday ? ['Saturday'] : [])],
    max_classes: preferences.maxClassesPerDay, session_minutes: TIMETABLE_SESSION_MINUTES, break_minutes: TIMETABLE_BREAK_MINUTES, timezone,
  };
}
