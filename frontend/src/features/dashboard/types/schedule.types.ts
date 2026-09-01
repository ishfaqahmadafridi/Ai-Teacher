export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type ScheduleViewMode = 'timeline' | 'grid';

export interface ScheduleItem {
  id: string;
  title: string;
  subject: string;
  timeFormatted: string;
  startTime?: string;
  endTime?: string;
  timeSlot?: string;
  dayOfWeek: DayOfWeek;
  instructorName: string;
  instructorAvatar?: string;
  roomOrLink: string;
  status: 'upcoming' | 'live' | 'completed';
}

export interface ScheduleHeaderBannerProps {
  viewMode: ScheduleViewMode;
  onViewModeChange: (mode: ScheduleViewMode) => void;
  onOpenAiPlanner?: () => void;
  onOpenManualCreate?: () => void;
  className?: string;
}

export interface CreateScheduleSlotFormValues {
  title: string;
  subject: string;
  dayOfWeek: DayOfWeek;
  timeSlot: string;
  instructorName: string;
  roomOrLink: string;
  status: 'upcoming' | 'live' | 'completed';
}

export interface CreateScheduleSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScheduleSlot: (item: ScheduleItem) => void;
}

export interface UseCreateScheduleSlotModalOptions {
  onClose: () => void;
  onAddScheduleSlot: (item: ScheduleItem) => void;
}

export interface CreateScheduleSlotHeaderProps {
  onClose: () => void;
  className?: string;
}

export interface CreateScheduleSlotFooterProps {
  onClose: () => void;
  className?: string;
}


export interface ScheduleViewModeToggleProps {
  viewMode: ScheduleViewMode;
  onViewModeChange: (mode: ScheduleViewMode) => void;
  className?: string;
}

export interface ScheduleDayItemProps {
  day: DayOfWeek;
  isSelected: boolean;
  count: number;
  hasLive: boolean;
  onSelectDay: (day: DayOfWeek) => void;
  className?: string;
}

export interface ScheduleDaySidebarProps {
  days: DayOfWeek[];
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  scheduleItems: ScheduleItem[];
  className?: string;
}

export interface ScheduleSlotHeaderProps {
  selectedDay: DayOfWeek;
  className?: string;
}

export interface ScheduleEmptyStateProps {
  selectedDay: DayOfWeek;
  className?: string;
}

export interface ScheduleTimelineItemProps {
  item: ScheduleItem;
  isLast: boolean;
  onJoinClass?: (id: string) => void;
  onSelectNoticeItem?: (item: ScheduleItem) => void;
  className?: string;
}

export interface ScheduleSlotListProps {
  selectedDay: DayOfWeek;
  scheduleItems: ScheduleItem[];
  onJoinClass?: (id: string) => void;
  onSelectNoticeItem?: (item: ScheduleItem) => void;
  className?: string;
}

export interface ScheduleTimelineViewProps {
  days: DayOfWeek[];
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  scheduleItems: ScheduleItem[];
  onJoinClass?: (id: string) => void;
  onSelectNoticeItem?: (item: ScheduleItem) => void;
  className?: string;
}

export interface ScheduleGridHeaderProps {
  weekdays: DayOfWeek[];
  className?: string;
}

export interface ScheduleGridCellProps {
  item?: ScheduleItem;
  day: DayOfWeek;
  onJoinClass?: (id: string) => void;
  onSelectNoticeItem?: (item: ScheduleItem) => void;
  className?: string;
}

export interface UseScheduleGridCellOptions {
  item?: ScheduleItem;
  onJoinClass?: (id: string) => void;
  onSelectNoticeItem?: (item: ScheduleItem) => void;
}

export interface ScheduledClassNoticeModalProps {
  isOpen: boolean;
  item: ScheduleItem | null;
  onClose: () => void;
}


export interface ScheduleGridRowProps {
  slot: string;
  weekdays: DayOfWeek[];
  scheduleItems: ScheduleItem[];
  onJoinClass?: (id: string) => void;
  onSelectNoticeItem?: (item: ScheduleItem) => void;
  className?: string;
}

export interface ScheduleWeeklyGridProps {
  scheduleItems: ScheduleItem[];
  onJoinClass?: (id: string) => void;
  onSelectNoticeItem?: (item: ScheduleItem) => void;
  className?: string;
}

export interface ScheduleItemCardProps {
  item: ScheduleItem;
  onJoinClass?: (id: string) => void;
  onSelectNoticeItem?: (item: ScheduleItem) => void;
  className?: string;
}

export interface UseScheduleItemCardOptions {
  item: ScheduleItem;
  onJoinClass?: (id: string) => void;
  onSelectNoticeItem?: (item: ScheduleItem) => void;
}

export interface ScheduleItemCardNoticePopoverProps {
  item: ScheduleItem;
  onClose: () => void;
}

export interface ScheduleItemCardBadgesProps {
  item: ScheduleItem;
  isLive: boolean;
}

export interface ScheduleItemCardActionButtonProps {
  isLive: boolean;
  onClick: (e?: React.MouseEvent) => void;
}

export interface ClassScheduleSectionProps {
  scheduleItems?: ScheduleItem[];
  onJoinClass?: (id: string) => void;
  className?: string;
}

export interface UseClassScheduleSectionOptions {
  scheduleItems?: ScheduleItem[];
  defaultDay?: DayOfWeek;
  defaultViewMode?: ScheduleViewMode;
}

export type PreferredTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'any';
export type MaxClassesPerDay = 2 | 3 | 4;

export interface StudentSchedulePreferences {
  preferredTime: PreferredTimeOfDay;
  maxClassesPerDay: MaxClassesPerDay;
  includeSaturday: boolean;
  registeredCourses: string[];
}

export interface SuggestedTimetable {
  className: string;
  schedule: ScheduleItem[];
  totalWeeklyClasses: number;
  optimizationSummary: string;
}

export interface TimetablePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPreferences: (preferences: StudentSchedulePreferences) => void;
  isLoading?: boolean;
}

export interface UseTimetablePreferencesModalOptions {
  onSubmitPreferences: (preferences: StudentSchedulePreferences) => void;
  initialPreferences?: Partial<StudentSchedulePreferences>;
}

export interface TimetablePreferencesModalHeaderProps {
  onClose: () => void;
  className?: string;
}

export interface TimetableTimePreferenceSelectorProps {
  preferredTime: PreferredTimeOfDay;
  onSelectTime: (time: PreferredTimeOfDay) => void;
  className?: string;
}

export interface TimetableMaxClassesSelectorProps {
  maxClassesPerDay: MaxClassesPerDay;
  onSelectMaxClasses: (count: MaxClassesPerDay) => void;
  className?: string;
}

export interface TimetableStudyDaysSelectorProps {
  includeSaturday: boolean;
  onSelectIncludeSaturday: (includeSaturday: boolean) => void;
  className?: string;
}

export interface TimetablePreferencesModalFooterProps {
  onClose: () => void;
  isLoading?: boolean;
  className?: string;
}

export interface TimetableSuggestionReviewModalProps {
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



