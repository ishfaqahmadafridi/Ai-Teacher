export interface PerformanceTrendPoint {
  day: string;
  score: number;
}

/**
 * Standard academic study weekdays (Monday to Friday).
 */
export const DEFAULT_PERFORMANCE_TREND_DATA: PerformanceTrendPoint[] = [
  { day: 'Mon', score: 68 },
  { day: 'Tue', score: 75 },
  { day: 'Wed', score: 85 },
  { day: 'Thu', score: 80 },
  { day: 'Fri', score: 95 },
];

export const DEFAULT_MONTHLY_TREND_DATA: PerformanceTrendPoint[] = [
  { day: 'Wk 1', score: 70 },
  { day: 'Wk 2', score: 78 },
  { day: 'Wk 3', score: 86 },
  { day: 'Wk 4', score: 94 },
];
