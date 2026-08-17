import type { ContinueLearningCourse } from './dashboard.types';

export interface DashboardHeroSectionProps {
  studentName: string;
  streakDays: number;
  weeklyProgressPercent: number;
  greeting?: string;
  onJoinTodayClass?: () => void;
  onViewSchedule?: () => void;
  className?: string;
}

export interface UseDashboardHeroSectionOptions {
  greeting?: string;
}

export interface HeroGreetingContentProps {
  greeting: string;
  studentName: string;
  weeklyProgressPercent: number;
  className?: string;
}

export interface HeroStudyIllustrationProps {
  className?: string;
}

export interface HeroBackgroundParticlesProps {
  className?: string;
}

export interface ContinueLearningBannerProps {
  course: ContinueLearningCourse;
  onResume?: () => void;
  className?: string;
}
