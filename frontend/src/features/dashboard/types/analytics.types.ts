import type { PerformanceTrendPoint } from '../constants/analyticsConstants';
export * from './progress.types';

export interface ProgressAnalyticsCardProps {
  weeklyProgressPercent?: number;
  streakDays?: number;
  attendancePercent?: number;
  classesAttended?: number;
  totalClasses?: number;
  classBehaviorScore?: number;
  aiFocusScore?: number;
  conceptMasteryScore?: number;
  doubtsResolvedCount?: number;
  assignmentsCompleted?: number;
  totalAssignments?: number;
  quizzesPassed?: number;
  totalQuizzes?: number;
  className?: string;
}

export interface UseProgressAnalyticsCardOptions {
  weeklyProgressPercent?: number;
}

export interface AnalyticsHeaderProps {
  activeTimeframe: 'week' | 'month';
  onSelectTimeframe: (tf: 'week' | 'month') => void;
  className?: string;
}

export interface AnalyticsGaugeSectionProps {
  weeklyProgressPercent: number;
  attendancePercent: number;
  classesAttended: number;
  totalClasses: number;
  className?: string;
}

export interface AnalyticsTrendGraphProps {
  trendData: PerformanceTrendPoint[];
  className?: string;
}

export interface AnalyticsMetricCardItem {
  id: string;
  label: string;
  value: string;
  iconName: 'file-check' | 'help-circle' | 'zap' | 'brain' | 'sparkles' | 'award';
  accentTheme: 'blue' | 'purple' | 'amber' | 'cyan' | 'emerald';
}

export interface AnalyticsMetricCardProps {
  item: AnalyticsMetricCardItem;
  className?: string;
}

export interface AnalyticsMetricsGridProps {
  assignmentsCompleted: number;
  totalAssignments: number;
  quizzesPassed: number;
  totalQuizzes: number;
  aiFocusScore: number;
  conceptMasteryScore: number;
  classBehaviorScore: number;
  avgScore?: number;
  className?: string;
}

export interface UseAnalyticsMetricsGridOptions {
  assignmentsCompleted: number;
  totalAssignments: number;
  quizzesPassed: number;
  totalQuizzes: number;
  aiFocusScore: number;
  conceptMasteryScore: number;
  classBehaviorScore: number;
  avgScore?: number;
}

export interface AnalyticsStreakFooterProps {
  streakDays: number;
  className?: string;
}
