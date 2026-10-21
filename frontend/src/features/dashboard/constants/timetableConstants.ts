import type { PreferredTimeOfDay } from '../types/timetablePreferences.types';
export const TIMETABLE_TIME_WINDOWS: Record<Exclude<PreferredTimeOfDay, 'custom'>, readonly [string, string]> = {
  morning: ['09:00', '12:30'], afternoon: ['14:00', '17:00'], evening: ['16:00', '19:30'], any: ['09:00', '19:30'],
};
export const TIMETABLE_SESSION_MINUTES = 90;
export const TIMETABLE_BREAK_MINUTES = 30;
export const SAVED_TIMETABLE_REFRESH_MS = 30_000;
export const TIMETABLE_JOB_POLL_MS = 2_000;
