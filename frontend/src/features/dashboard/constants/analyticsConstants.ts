export interface PerformanceTrendPoint {
  day: string;
  score: number;
}

/**
 * Standard academic study weekdays (Monday to Friday).
 */
export const DEFAULT_PERFORMANCE_TREND_DATA: PerformanceTrendPoint[] = [];

export const DEFAULT_MONTHLY_TREND_DATA: PerformanceTrendPoint[] = [];

export const ANALYTICS_SCORE_TICKS = [100, 75, 50, 25, 0] as const;
export const ANALYTICS_WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export const ANALYTICS_MONTH_LABELS = ['Day 1', 'Day 7', 'Day 14', 'Day 21', 'Day 30'] as const;
