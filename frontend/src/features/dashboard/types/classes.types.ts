import type { LiveClassItem } from './dashboard.types';

export interface LiveClassesSectionProps {
  classes?: LiveClassItem[];
  onJoinClass?: (id: string) => void;
  className?: string;
}

export interface ClassCardMetrics {
  progress: number;
  completed: number;
  total: number;
  remaining: number;
  remainingPercent: number;
}

export interface ClassCardProps {
  classItem: LiveClassItem;
  onJoinClass?: (id: string) => void;
  className?: string;
}

export interface ClassCardHeaderProps {
  subject: string;
  isLive: boolean;
}

export interface ClassCardMetaInfoProps {
  timeFormatted: string;
  attendanceCount: number;
}

export interface ClassCardProgressBarProps {
  metrics: ClassCardMetrics;
  timeRemaining?: string;
}

export interface ClassCardActionButtonProps {
  classItem: LiveClassItem;
  onJoinClass?: (id: string) => void;
}
