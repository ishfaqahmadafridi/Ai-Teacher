'use client';

import { memo } from 'react';
import { Video, ArrowRight } from 'lucide-react';
import type { ScheduleItemCardActionButtonProps } from '../../types/schedule.types';

export const ScheduleItemCardActionButton = memo(function ScheduleItemCardActionButton({
  isLive,
  onClick,
}: ScheduleItemCardActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full md:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 border shadow-lg cursor-pointer shrink-0 relative z-10 ${
        isLive
          ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white border-[#EF4444] shadow-[#EF4444]/30 animate-pulse'
          : 'bg-[#1E293B] hover:bg-[#2563EB] text-white border-[#334155] hover:border-[#38BDF8]/50'
      }`}
    >
      <Video className="w-4 h-4 text-white" />
      <span>{isLive ? 'Join Live Stream' : 'Join Session'}</span>
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
  );
});

ScheduleItemCardActionButton.displayName = 'ScheduleItemCardActionButton';
