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
  className?: string;
}

export interface ScheduleSlotListProps {
  selectedDay: DayOfWeek;
  scheduleItems: ScheduleItem[];
  onJoinClass?: (id: string) => void;
  className?: string;
}

export interface ScheduleTimelineViewProps {
  days: DayOfWeek[];
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  scheduleItems: ScheduleItem[];
  onJoinClass?: (id: string) => void;
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
  className?: string;
}

export interface ScheduleGridRowProps {
  slot: string;
  weekdays: DayOfWeek[];
  scheduleItems: ScheduleItem[];
  onJoinClass?: (id: string) => void;
  className?: string;
}

export interface ScheduleWeeklyGridProps {
  scheduleItems: ScheduleItem[];
  onJoinClass?: (id: string) => void;
  className?: string;
}

export interface ScheduleItemCardProps {
  item: ScheduleItem;
  onJoinClass?: (id: string) => void;
  className?: string;
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
