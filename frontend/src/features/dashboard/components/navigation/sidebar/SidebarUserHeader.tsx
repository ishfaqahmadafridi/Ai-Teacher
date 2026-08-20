'use client';

import { memo } from 'react';
import { useTimeGreeting } from '../../../hooks';
import type { SidebarUserHeaderProps } from '../../../types/sidebar.types';

export const SidebarUserHeader = memo(function SidebarUserHeader({
  studentName,
  studentAvatar,
  dateFormatted,
  greeting: customGreeting,
  onOpenProfile,
  className = '',
}: SidebarUserHeaderProps) {
  const timeGreeting = useTimeGreeting();
  const greeting = customGreeting ?? timeGreeting;

  return (
    <div className={`p-4 rounded-3xl bg-[#090D16] border border-[#1E293B] flex items-center gap-3.5 ${className}`}>
      <button
        type="button"
        onClick={onOpenProfile}
        aria-label="View Student Profile"
        className="relative w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-[#8B5CF6]/40 hover:ring-[#8B5CF6] transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
      >
        <img
          src={studentAvatar}
          alt={studentName}
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#090D16]" />
      </button>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-medium text-[#8B5CF6] block leading-tight">
          {greeting}
        </span>
        <h2 className="text-sm font-bold text-white truncate leading-snug">
          {studentName}
        </h2>
        <span className="text-[10px] text-[#64748B] block leading-tight">
          {dateFormatted}
        </span>
      </div>
    </div>
  );
});

SidebarUserHeader.displayName = 'SidebarUserHeader';
