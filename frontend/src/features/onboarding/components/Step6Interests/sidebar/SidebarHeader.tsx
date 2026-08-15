'use client';

import { memo } from 'react';
import { Calendar } from 'lucide-react';
import type { SidebarHeaderProps } from '../../../types';

export const SidebarHeader = memo(function SidebarHeader({
  title,
  studyMode,
}: SidebarHeaderProps) {
  return (
    <div className="space-y-1 relative z-10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Calendar className="w-5 h-5 text-[#38BDF8] shrink-0" />
          <h4 className="text-base font-extrabold text-white tracking-tight truncate">
            {title}
          </h4>
        </div>
        <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
          {studyMode === 'timetable' ? 'Timetable' : 'Self-Paced'}
        </span>
      </div>
      <p className="text-[#94A3B8] text-xs">
        Personalized academic roadmap & study schedule.
      </p>
    </div>
  );
});

SidebarHeader.displayName = 'SidebarHeader';
