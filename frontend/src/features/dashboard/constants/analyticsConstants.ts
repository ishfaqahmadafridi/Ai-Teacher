export interface PerformanceTrendPoint {
  day: string;
  score: number;
}

/**
 * Standard academic study weekdays (Monday to Friday).
 */
export const DEFAULT_PERFORMANCE_TREND_DATA: PerformanceTrendPoint[] = [];

export const DEFAULT_MONTHLY_TREND_DATA: PerformanceTrendPoint[] = [];
