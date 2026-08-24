import type { DashboardNavLink } from './dashboard.types';

export interface DashboardSideNavProps {
  activeTabId?: string;
  onSelectTab?: (id: string) => void;
  studentName: string;
  dateFormatted: string;
  studentAvatar: string;
  streakDays?: number;
  coursesCount?: number;
  greeting?: string;
  onJoinTodayClass?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  className?: string;
}

export interface SidebarUserHeaderProps {
  studentName: string;
  studentAvatar: string;
  dateFormatted: string;
  streakDays?: number;
  coursesCount?: number;
  greeting?: string;
  onOpenProfile?: () => void;
  className?: string;
}

export interface UserAvatarBadgeProps {
  studentAvatar: string;
  studentName: string;
}

export interface UserInfoTitleProps {
  studentName: string;
}

export interface UserStatsRowProps {
  coursesCount: number;
  streakDays: number;
}

export interface NavTabItemProps {
  link: DashboardNavLink;
  isActive: boolean;
  onSelectTab?: (id: string) => void;
  className?: string;
}

export interface NavTabListProps {
  navLinks: DashboardNavLink[];
  activeTabId: string;
  onSelectTab?: (id: string) => void;
  className?: string;
}

export interface SidebarFooterSettingsProps {
  settingsLink?: DashboardNavLink;
  activeTabId: string;
  studentName: string;
  onSelectTab?: (id: string) => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  className?: string;
}

export interface UseDashboardSideNavOptions {
  activeTabId?: string;
  studentName?: string;
}
