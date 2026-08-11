import React from 'react';
import {
  LayoutDashboard,
  Settings,
  BookOpen,
  Calendar,
} from 'lucide-react';
import type { DashboardNavLink } from '../types/dashboard.types';

export const SIDEBAR_ICON_MAP: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="w-5 h-5 shrink-0" aria-hidden="true" />,
  registered_courses: <BookOpen className="w-5 h-5 shrink-0" aria-hidden="true" />,
  schedule: <Calendar className="w-5 h-5 shrink-0" aria-hidden="true" />,
  settings: <Settings className="w-5 h-5 shrink-0" aria-hidden="true" />,
};

export const DEFAULT_DASHBOARD_NAV_LINKS: DashboardNavLink[] = [
  { id: 'dashboard', label: 'Dashboard Overview', iconName: 'LayoutDashboard', href: '/dashboard' },
  { id: 'registered_courses', label: 'Registered Courses', iconName: 'BookOpen', href: '/dashboard', badgeCount: 4 },
  { id: 'schedule', label: 'Class Schedule', iconName: 'Calendar', href: '/dashboard', badgeCount: 7 },
  { id: 'settings', label: 'Settings', iconName: 'Settings', href: '/dashboard' },
];
