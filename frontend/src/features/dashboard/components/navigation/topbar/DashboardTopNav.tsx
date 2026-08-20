'use client';

import { memo } from 'react';
import { NavBrandHeader } from '../sidebar/NavBrandHeader';
import { NavSearchBar } from '../search/NavSearchBar';
import { NavActionControls } from './NavActionControls';
import type { DashboardTopNavProps } from '../../../types/topbar.types';

export const DashboardTopNav = memo(function DashboardTopNav({
  searchQuery,
  onSearchChange,
  onSelectSearchResult,
  unreadNotificationsCount = 2,
  studentAvatar,
  onOpenProfile,
  onOpenSettings,
  onNotificationClick,
  className = '',
}: DashboardTopNavProps) {
  return (
    <header
      className={`h-20 bg-[#030712]/80 backdrop-blur-xl border-b border-[#1E293B] px-8 flex items-center justify-between shrink-0 z-40 ${className}`}
    >
      <NavBrandHeader className="lg:hidden" />

      <NavSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSelectSearchResult={onSelectSearchResult}
      />

      <NavActionControls
        unreadNotificationsCount={unreadNotificationsCount}
        studentAvatar={studentAvatar}
        onOpenProfile={onOpenProfile}
        onOpenSettings={onOpenSettings}
        onNotificationClick={onNotificationClick}
      />
    </header>
  );
});

DashboardTopNav.displayName = 'DashboardTopNav';
