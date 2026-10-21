import { DAYS_OF_WEEK } from './scheduleConstants';
export const STUDY_PLAN_DURATIONS = [
  { value: 2, label: '2 months' },
  { value: 3, label: '3 months' },
  { value: 4, label: '4 months' },
] as const;
export const DEFAULT_STUDY_PLAN_MONTHS = 2;
export const DAYS_PER_STUDY_WEEK = 7;

export const DEFAULT_STUDY_PLAN_DAYS = DAYS_OF_WEEK.slice(0, 5);
