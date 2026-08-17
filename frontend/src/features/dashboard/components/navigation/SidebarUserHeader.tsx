'use client';

import { memo } from 'react';
import { useTimeGreeting } from '../../hooks';
import type { SidebarUserHeaderProps } from '../../types/sidebar.types';

export const SidebarUserHeader = memo(function SidebarUserHeader({
  studentName,
  studentAvatar,
  dateFormatted,
  greeting: customGreeting,
  onOpenProfile,
  className = '',
}: SidebarUserHeaderProps) {
  const timeGreeting = useTimeGreeting();
  const greeting = customGreeting || timeGreeting;

  return (
    <div className={`mb-6 mt-1 ${className}`}>
      <button
        type="button"
        onClick={onOpenProfile}
        title="Click to view & edit profile"
        className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-[#121B2D] transition-all cursor-pointer text-left w-full border border-transparent hover:border-[#38BDF8]/20 group"
      >
        <img
          src={studentAvatar}
          alt={studentName}
          className="w-11 h-11 rounded-full object-cover border-2 border-[#1E293B] group-hover:border-[#38BDF8] shrink-0 transition-colors shadow-md"
        />
        <div className="min-w-0 flex-1">
          <h2 className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-white truncate group-hover:text-[#38BDF8] transition-colors">
            {greeting}, {studentName}
          </h2>
          <p className="font-['JetBrains_Mono',monospace] text-[11px] text-[#94A3B8] mt-0.5">
            {dateFormatted}
          </p>
        </div>
      </button>
    </div>
  );
});

SidebarUserHeader.displayName = 'SidebarUserHeader';
