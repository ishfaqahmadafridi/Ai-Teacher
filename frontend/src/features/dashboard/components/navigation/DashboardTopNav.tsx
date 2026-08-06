'use client';

import { memo } from 'react';
import { Search, Bell, Settings, Brain } from 'lucide-react';
import type { DashboardTopNavProps } from '../../types/dashboard.types';

export const DashboardTopNav = memo(function DashboardTopNav({
  searchQuery,
  onSearchChange,
  unreadNotificationsCount = 2,
  studentAvatar,
  className = '',
}: DashboardTopNavProps) {
  return (
    <header
      className={`hidden md:flex backdrop-blur-xl bg-white/80 border-b border-[#E2E8F0] fixed top-0 left-0 w-full z-50 justify-between items-center px-10 h-20 pl-72 ${className}`}
    >
      {/* Left: Brand Title NEUROLEARN */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#004ac6] via-[#2563eb] to-[#0ea5e9] text-white flex items-center justify-center shadow-md shadow-[#2563eb]/25 shrink-0">
          <Brain className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <span className="font-['Hanken_Grotesk',sans-serif] text-xl font-black text-[#004ac6] tracking-wider uppercase">
          NEUROLEARN
        </span>
      </div>

      {/* Right: Search & Actions */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative hidden lg:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search classes, assignments, topics..."
            aria-label="Search Dashboard"
            className="bg-[#F1F5F9] border-none rounded-full py-2 pl-4 pr-10 text-sm font-['Hanken_Grotesk',sans-serif] text-[#0F172A] placeholder-[#737686] focus:ring-2 focus:ring-[#2563eb] focus:bg-white transition-all w-64 md:w-72 outline-none"
          />
          <Search className="w-5 h-5 absolute right-3 top-2.5 text-[#737686]" aria-hidden="true" />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2 text-[#475569] hover:text-[#004ac6] transition-colors cursor-pointer rounded-full hover:bg-slate-100"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#2563eb]" />
            )}
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="p-2 text-[#475569] hover:text-[#004ac6] transition-colors cursor-pointer rounded-full hover:bg-slate-100"
          >
            <Settings className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Student Profile Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E2E8F0] shrink-0">
            <img
              src={studentAvatar}
              alt="Student Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
});

DashboardTopNav.displayName = 'DashboardTopNav';
