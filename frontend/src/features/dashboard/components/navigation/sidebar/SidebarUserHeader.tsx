'use client';

import { memo } from 'react';
import type { SidebarUserHeaderProps } from '../../../types/sidebar.types';

export const SidebarUserHeader = memo(function SidebarUserHeader({
  studentName,
  studentAvatar,
  streakDays = 128,
  coursesCount = 12,
  className = '',
}: SidebarUserHeaderProps) {
  return (
    <div className={`px-3 py-4 space-y-4 ${className}`}>

      {/* Top Row — Avatar + Name + Badge */}
      <div className="flex items-center gap-4">

        {/* Circular Avatar with Gradient Ring */}
        <div className="relative shrink-0">
          {/* Gradient ring */}
          <div
            className="w-16 h-16 rounded-full p-[2.5px]"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0F18]">
              <img
                src={studentAvatar}
                alt={studentName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Online dot */}
          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#030712] shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
        </div>

        {/* Name + Badge */}
        <div className="min-w-0">
          <p className="text-lg font-bold text-white tracking-tight truncate leading-tight">
            {studentName}
          </p>
          <div className="mt-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#7C3AED]/50 bg-[#7C3AED]/10 text-[#C4B5FD] text-[11px] font-bold tracking-widest uppercase">
              {/* Graduation cap */}
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.5L5.21 11.5 4 12.18V17c0 1.1 3.58 3 8 3s8-1.9 8-3v-4.82l-1.21-.68L12 15.5z" />
              </svg>
              Student
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row — no dividers, just gap */}
      <div className="flex items-start gap-5">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white leading-tight">{coursesCount}</span>
          <span className="text-[9px] text-[#475569] uppercase tracking-wider mt-0.5">Courses</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white leading-tight">{streakDays}</span>
          <span className="text-[9px] text-[#475569] uppercase tracking-wider mt-0.5">Streak</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white leading-tight">Yr 3</span>
          <span className="text-[9px] text-[#475569] uppercase tracking-wider mt-0.5">CS Major</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 shadow-[0_0_4px_rgba(16,185,129,0.9)]" />
          <span className="text-[10px] text-[#10B981] font-semibold whitespace-nowrap">Active</span>
        </div>
      </div>

    </div>
  );
});

SidebarUserHeader.displayName = 'SidebarUserHeader';
