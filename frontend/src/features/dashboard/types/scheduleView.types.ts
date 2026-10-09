import type { DayOfWeek, ScheduleItem, ScheduleViewMode } from './scheduleDomain.types';

export interface ScheduleHeaderBannerProps {
  viewMode: ScheduleViewMode;
  onViewModeChange: (mode: ScheduleViewMode) => void;
  onOpenAiPlanner?: () => void;
  onOpenManualCreate?: () => void;
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
  slots: string[];
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
  day: DayOfWeek;
  slots: string[];
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
