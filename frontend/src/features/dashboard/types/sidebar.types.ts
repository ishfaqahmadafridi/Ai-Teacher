export interface DashboardSideNavProps {
  activeTabId?: string;
  onSelectTab?: (id: string) => void;
  studentName: string;
  dateFormatted: string;
  studentAvatar: string;
  onJoinTodayClass?: () => void;
  onOpenProfile?: () => void;
  className?: string;
}
