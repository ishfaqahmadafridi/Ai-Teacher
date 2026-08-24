'use client';

import { memo } from 'react';
import type { UserStatsRowProps } from '../../../types/sidebar.types';

export const UserStatsRow = memo(function UserStatsRow({
  coursesCount,
  streakDays,
}: UserStatsRowProps) {
  return (
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
  );
});

UserStatsRow.displayName = 'UserStatsRow';
