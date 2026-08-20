export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeFormatted: string;
  type: 'deadline_reminder' | 'task_assigned' | 'quiz_assigned' | 'graded';
  isUnread: boolean;
  taskId?: string;
}

export interface NavBrandHeaderProps {
  brandName?: string;
  className?: string;
}

export type SearchResultType = 'course' | 'assignment' | 'live_class' | 'topic';

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  badgeText: string;
  actionPayload: {
    targetTab?: string;
    courseId?: string;
    taskId?: string;
    classId?: string;
  };
}

export interface SearchGroupedResults {
  courses: SearchResultItem[];
  assignments: SearchResultItem[];
  liveClasses: SearchResultItem[];
  topics: SearchResultItem[];
  totalCount: number;
}

export interface SearchResultRowProps {
  item: SearchResultItem;
  onSelect: (item: SearchResultItem) => void;
  className?: string;
}

export interface NavSearchResultsDropdownProps {
  isOpen: boolean;
  searchQuery: string;
  results: SearchGroupedResults;
  onSelectResult: (item: SearchResultItem) => void;
  onClose: () => void;
  className?: string;
}

export interface NavSearchBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSelectSearchResult?: (item: SearchResultItem) => void;
  placeholder?: string;
  className?: string;
}

export interface UseNavSearchBarOptions {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSelectSearchResult?: (item: SearchResultItem) => void;
}

export interface NavActionControlsProps {
  unreadNotificationsCount?: number;
  studentAvatar: string;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  className?: string;
}

export interface NavNotificationButtonProps {
  unreadCount: number;
  onClick: () => void;
  className?: string;
}

export interface NavSettingsButtonProps {
  onClick?: () => void;
  className?: string;
}

export interface NavProfileAvatarButtonProps {
  studentAvatar: string;
  onClick?: () => void;
  className?: string;
}

export interface NotificationDropdownProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onDismissNotification: (id: string) => void;
  onSelectNotification?: (notification: NotificationItem) => void;
  onClose: () => void;
  className?: string;
}

export interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onClose: () => void;
  className?: string;
}

export interface NotificationCardItemProps {
  notification: NotificationItem;
  onDismiss: (id: string) => void;
  onSelect?: (notification: NotificationItem) => void;
  className?: string;
}

export interface NotificationCardIconProps {
  isDeadline: boolean;
  isGraded: boolean;
  iconStyles: string;
  className?: string;
}

export interface NotificationCardContentProps {
  title: string;
  message: string;
  timeFormatted: string;
  className?: string;
}

export interface NotificationEmptyStateProps {
  message?: string;
  className?: string;
}

export interface UseNotificationDropdownOptions {
  initialNotifications?: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem) => void;
}

export interface DashboardTopNavProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSelectSearchResult?: (item: SearchResultItem) => void;
  unreadNotificationsCount?: number;
  studentAvatar: string;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  className?: string;
}

