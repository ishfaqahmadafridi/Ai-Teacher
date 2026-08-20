'use client';

import { memo } from 'react';
import { useDashboardSideNav } from '../../../hooks/useDashboardSideNav';
import { SidebarUserHeader } from './SidebarUserHeader';
import { NavTabList } from './NavTabList';
import { SidebarFooterSettings } from './SidebarFooterSettings';
import type { DashboardSideNavProps } from '../../../types/sidebar.types';

export const DashboardSideNav = memo(function DashboardSideNav({
  activeTabId = 'dashboard',
  onSelectTab,
  studentName,
  dateFormatted,
  studentAvatar,
  onOpenProfile,
  onOpenSettings,
  className = '',
}: DashboardSideNavProps) {
  const { mainNavLinks, settingsLink } = useDashboardSideNav({
    studentName,
  });

  return (
    <aside
      className={`w-72 bg-[#030712] border-r border-[#1E293B] flex flex-col p-6 space-y-6 shrink-0 h-full ${className}`}
    >
      <SidebarUserHeader
        studentName={studentName}
        studentAvatar={studentAvatar}
        dateFormatted={dateFormatted}
        onOpenProfile={onOpenProfile}
      />

      <NavTabList
        navLinks={mainNavLinks}
        activeTabId={activeTabId}
        onSelectTab={onSelectTab}
      />

      <SidebarFooterSettings
        settingsLink={settingsLink}
        activeTabId={activeTabId}
        studentName={studentName}
        onSelectTab={onSelectTab}
        onOpenProfile={onOpenProfile}
        onOpenSettings={onOpenSettings}
      />
    </aside>
  );
});

DashboardSideNav.displayName = 'DashboardSideNav';
