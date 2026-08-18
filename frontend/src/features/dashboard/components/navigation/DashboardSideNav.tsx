'use client';

import { memo } from 'react';
import { useDashboardSideNav } from '../../hooks/useDashboardSideNav';
import { SidebarUserHeader } from './SidebarUserHeader';
import { NavTabList } from './NavTabList';
import { SidebarFooterSettings } from './SidebarFooterSettings';
import type { DashboardSideNavProps } from '../../types/sidebar.types';

export const DashboardSideNav = memo(function DashboardSideNav({
  activeTabId = 'dashboard',
  onSelectTab,
  studentName,
  dateFormatted,
  studentAvatar,
  greeting,
  onOpenProfile,
  onOpenSettings,
  className = '',
}: DashboardSideNavProps) {
  const { mainNavLinks, settingsLink } = useDashboardSideNav({ studentName });

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#070C18] border-r border-[#162032] shadow-2xl fixed left-0 top-20 h-[calc(100vh-5rem)] w-72 p-6 z-40 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {/* Student Profile Header */}
      <SidebarUserHeader
        studentName={studentName}
        studentAvatar={studentAvatar}
        dateFormatted={dateFormatted}
        greeting={greeting}
        onOpenProfile={onOpenProfile}
      />

      {/* Main Navigation Links List */}
      <NavTabList
        navLinks={mainNavLinks}
        activeTabId={activeTabId}
        onSelectTab={onSelectTab}
      />

      {/* Pinned Bottom Settings Link */}
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
