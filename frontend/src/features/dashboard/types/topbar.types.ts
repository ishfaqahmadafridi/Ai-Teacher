export interface NavBrandHeaderProps {
  brandName?: string;
  className?: string;
}

export interface NavSearchBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export interface NavActionControlsProps {
  unreadNotificationsCount?: number;
  studentAvatar: string;
  onOpenProfile?: () => void;
  className?: string;
}

export interface DashboardTopNavProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  unreadNotificationsCount?: number;
  studentAvatar: string;
  onOpenProfile?: () => void;
  className?: string;
}

