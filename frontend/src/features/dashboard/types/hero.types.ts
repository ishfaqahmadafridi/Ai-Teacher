import type { ContinueLearningCourse } from './dashboard.types';

export interface DashboardHeroSectionProps {
  studentName: string;
  streakDays: number;
  weeklyProgressPercent: number;
  onJoinTodayClass?: () => void;
  onViewSchedule?: () => void;
  className?: string;
}

export interface ContinueLearningBannerProps {
  course: ContinueLearningCourse;
  onResume?: () => void;
  className?: string;
}
