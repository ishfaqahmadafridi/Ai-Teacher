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
