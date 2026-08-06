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
      className={`hidden md:flex backdrop-blur-xl bg-[#0B132B]/90 border-b border-[#1E293B] fixed top-0 left-0 w-full z-50 justify-between items-center px-10 h-20 pl-72 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {/* Left: Brand Title NEUROLEARN */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1d4ed8] via-[#2563eb] to-[#38bdf8] text-white flex items-center justify-center shadow-lg shadow-[#2563eb]/30 shrink-0">
          <Brain className="w-5.5 h-5.5 text-white" aria-hidden="true" />
        </div>
        <span className="font-['Hanken_Grotesk',sans-serif] text-xl font-black text-white tracking-[0.12em] uppercase">
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
            className="bg-[#0F172A] border border-[#1E293B] rounded-full py-2 pl-4 pr-10 text-sm font-['Hanken_Grotesk',sans-serif] text-[#F8FAFC] placeholder-[#94A3B8] focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-all w-64 md:w-72 outline-none"
          />
          <Search className="w-5 h-5 absolute right-3 top-2.5 text-[#94A3B8]" aria-hidden="true" />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2 text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer rounded-full hover:bg-[#1E293B]"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#38BDF8]" />
            )}
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="p-2 text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer rounded-full hover:bg-[#1E293B]"
          >
            <Settings className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Student Profile Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#1E293B] shrink-0">
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
