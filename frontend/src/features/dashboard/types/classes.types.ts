import type { LiveClassItem } from './dashboard.types';

export interface LiveClassesSectionProps {
  classes?: LiveClassItem[];
  onJoinClass?: (id: string) => void;
  className?: string;
}

export interface ClassCardProps {
  classItem: LiveClassItem;
  onJoinClass?: (id: string) => void;
  className?: string;
}
