export interface LessonNavigatorHeaderProps {
  title?: string;
  moduleSubtitle?: string;
}

export interface LessonTopicItem {
  id: string;
  title: string;
  isLive?: boolean;
  isDisabled?: boolean;
}

export interface ActiveLessonTreeProps {
  moduleTitle?: string;
  topics?: LessonTopicItem[];
  activeTopicId?: string;
  onSelectTopic?: (topicId: string) => void;
}

export interface LessonTreeHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

export interface TopicStatusDotProps {
  isLive?: boolean;
  className?: string;
}

export interface TopicLiveBadgeProps {
  className?: string;
}

export interface TopicItemTitleProps {
  title: string;
  isLive?: boolean;
  isActive?: boolean;
  className?: string;
}

export interface LessonTopicItemRowProps {
  topic: LessonTopicItem;
  isActive: boolean;
  onSelectTopic: (id: string) => void;
  className?: string;
}

export interface MobileDrawerBackdropProps {
  onClose: () => void;
  className?: string;
}

export interface MobileDrawerHeaderProps {
  onClose: () => void;
  title?: string;
  moduleSubtitle?: string;
  className?: string;
}

export interface NavTabItem {
  id: string;
  label: string;
  iconName: 'students' | 'notes' | 'assignments' | 'quiz' | 'announcements';
  badgeCount?: number;
}

export interface NavTabButtonRowProps {
  tab: NavTabItem;
  isActive: boolean;
  onSelectTab: (id: string) => void;
  className?: string;
}

export interface NavTabIconProps {
  iconName: NavTabItem['iconName'];
  className?: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late';
  avatarBg: string;
}

export interface StudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NavTabListProps {
  activeTabId?: string;
  onSelectTab?: (tabId: string) => void;
  onOpenStudentsModal?: () => void;
}

export interface StudentsCardHeaderProps {
  presentCount: number;
  totalCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

export interface StudentSummaryDotProps {
  variant: 'total' | 'present' | 'absent';
  className?: string;
}

export interface StudentSummaryRowProps {
  label: string;
  count: number;
  variant: 'total' | 'present' | 'absent';
  className?: string;
}

export interface StudentsCardProps {
  presentCount?: number;
  totalCount?: number;
  absentCount?: number;
  className?: string;
}

export interface StudentsModalHeaderProps {
  onClose: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export interface StudentsModalStatsBarProps {
  total: number;
  present: number;
  absent: number;
  className?: string;
}

export interface FilterPillButtonProps {
  id: 'all' | 'present' | 'absent';
  label: string;
  count: number;
  isActive: boolean;
  activeColor: string;
  onClick: (id: 'all' | 'present' | 'absent') => void;
  className?: string;
}

export interface RosterSearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export interface StudentsModalFilterBarProps {
  filter: 'all' | 'present' | 'absent';
  onFilterChange: (val: 'all' | 'present' | 'absent') => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalCount: number;
  presentCount: number;
  absentCount: number;
  className?: string;
}

export interface StudentRosterRowProps {
  student: StudentRecord;
  className?: string;
}

export interface SidebarProps {
  onAsk?: (q: string) => void;
  loading?: boolean;
  isPlaying?: boolean;
}

export interface KeyPointsPanelProps {
  isPlaying: boolean;
}

export interface SuggestionsListProps {
  onAsk: (q: string) => void;
  loading: boolean;
  isPlaying: boolean;
}

export interface VoiceSelectorProps {
  className?: string;
}

