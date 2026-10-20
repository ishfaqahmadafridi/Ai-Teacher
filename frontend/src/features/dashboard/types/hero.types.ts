import type { CSSProperties } from 'react';
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
  sceneStyle: CSSProperties & Record<`--hero-${string}`, string | number>;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export interface HeroBackgroundParticlesProps {
  className?: string;
}

export interface ContinueLearningBannerProps {
  fieldName: string;
  onResume?: () => void;
  className?: string;
}
