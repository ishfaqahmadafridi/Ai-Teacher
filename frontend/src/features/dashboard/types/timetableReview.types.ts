import type { DayOfWeek, ScheduleItem } from './scheduleDomain.types';

export interface SuggestedTimetable {
  className: string;
  schedule: ScheduleItem[];
  totalWeeklyClasses: number;
  optimizationSummary: string;
}

export interface TimetableSuggestionReviewModalProps {
  error?: string | null;
  isOpen: boolean;
  suggestion: SuggestedTimetable | null;
  onClose: () => void;
  onAcceptTimetable: (schedule: ScheduleItem[]) => void;
  onCustomizeSlot?: (itemId: string, newDay: DayOfWeek, newSlot: string) => void;
}

export interface UseTimetableSuggestionReviewModalOptions {
  suggestion: SuggestedTimetable | null;
  onAcceptTimetable: (schedule: ScheduleItem[]) => void;
  onCustomizeSlot?: (itemId: string, newDay: DayOfWeek, newSlot: string) => void;
}

export interface TimetableSuggestionReviewHeaderProps {
  optimizationSummary: string;
  onClose: () => void;
  className?: string;
}

export interface TimetableSuggestionCardProps {
  item: ScheduleItem;
  className?: string;
}

export interface TimetableSuggestionReviewGridProps {
  schedule: ScheduleItem[];
  totalWeeklyClasses: number;
  className?: string;
}

export interface TimetableSuggestionConstraintBannerProps {
  className?: string;
}

export interface TimetableSuggestionReviewFooterProps {
  onClose: () => void;
  onAccept: () => void;
  onCustomize?: () => void;
  className?: string;
}
