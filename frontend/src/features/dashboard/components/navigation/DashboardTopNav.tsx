'use client';

import { memo } from 'react';
import { NavBrandHeader } from './NavBrandHeader';
import { NavSearchBar } from './NavSearchBar';
import { NavActionControls } from './NavActionControls';
import type { DashboardTopNavProps } from '../../types/topbar.types';

export const DashboardTopNav = memo(function DashboardTopNav({
  searchQuery,
  onSearchChange,
  unreadNotificationsCount = 2,
  studentAvatar,
  onOpenProfile,
  className = '',
}: DashboardTopNavProps) {
  return (
    <header
      className={`hidden md:flex backdrop-blur-xl bg-[#0B132B]/90 border-b border-[#1E293B] fixed top-0 left-0 w-full z-50 justify-between items-center px-10 h-20 pl-72 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {/* Left: Brand Header */}
      <NavBrandHeader />

      {/* Right: Search & Action Controls */}
      <div className="flex items-center gap-6">
        <NavSearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
        <NavActionControls
          unreadNotificationsCount={unreadNotificationsCount}
          studentAvatar={studentAvatar}
          onOpenProfile={onOpenProfile}
        />
      </div>
    </header>
  );
});

DashboardTopNav.displayName = 'DashboardTopNav';
