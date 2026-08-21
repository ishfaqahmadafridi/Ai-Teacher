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
      className={`h-20 bg-[#030712]/80 backdrop-blur-xl px-8 flex items-center justify-between shrink-0 sticky top-0 z-40 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {/* Left: NEUROLEARN Brand Logo — right side of the sidebar border */}
      <NavBrandHeader />

      {/* Right: Search Bar + Action Controls */}
      <div className="flex items-center gap-5">
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
      </div>
    </header>
  );
});

DashboardTopNav.displayName = 'DashboardTopNav';
