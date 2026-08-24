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
  streakDays,
  coursesCount,
  onOpenProfile,
  onOpenSettings,
  className = '',
}: DashboardSideNavProps) {
  const { mainNavLinks, settingsLink } = useDashboardSideNav({ studentName });

  return (
    <aside
      className={`w-72 bg-[#030712] border-r border-[#1E293B] flex flex-col shrink-0 h-screen sticky top-0 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {/* ── Profile at top ── */}
      <div className="px-5 pt-6 pb-4 shrink-0">
        <SidebarUserHeader
          studentName={studentName}
          studentAvatar={studentAvatar}
          dateFormatted={dateFormatted}
          streakDays={streakDays}
          coursesCount={coursesCount}
          onOpenProfile={onOpenProfile}
        />
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 border-t border-[#1E293B]" />

      {/* ── Nav links — scrollable middle ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <NavTabList
          navLinks={mainNavLinks}
          activeTabId={activeTabId}
          onSelectTab={onSelectTab}
        />
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 border-t border-[#1E293B]" />

      {/* ── Settings pinned at bottom ── */}
      <div className="px-5 py-4 shrink-0">
        <SidebarFooterSettings
          settingsLink={settingsLink}
          activeTabId={activeTabId}
          studentName={studentName}
          onSelectTab={onSelectTab}
          onOpenProfile={onOpenProfile}
          onOpenSettings={onOpenSettings}
        />
      </div>
    </aside>
  );
});

DashboardSideNav.displayName = 'DashboardSideNav';
