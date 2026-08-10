import type { DashboardNavLink } from '../types/dashboard.types';

export const DEFAULT_DASHBOARD_NAV_LINKS: DashboardNavLink[] = [
  { id: 'dashboard', label: 'Dashboard Overview', iconName: 'LayoutDashboard', href: '/dashboard' },
  { id: 'registered_courses', label: 'Registered Courses', iconName: 'BookOpen', href: '/dashboard' },
  { id: 'settings', label: 'Settings', iconName: 'Settings', href: '/dashboard' },
];
