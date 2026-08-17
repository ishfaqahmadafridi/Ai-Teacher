import type { DashboardNavLink } from './dashboard.types';

export interface DashboardSideNavProps {
  activeTabId?: string;
  onSelectTab?: (id: string) => void;
  studentName: string;
  dateFormatted: string;
  studentAvatar: string;
  greeting?: string;
  onJoinTodayClass?: () => void;
  onOpenProfile?: () => void;
  className?: string;
}

export interface SidebarUserHeaderProps {
  studentName: string;
  studentAvatar: string;
  dateFormatted: string;
  greeting?: string;
  onOpenProfile?: () => void;
  className?: string;
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
  className?: string;
}

export interface UseDashboardSideNavOptions {
  activeTabId?: string;
  studentName?: string;
}
