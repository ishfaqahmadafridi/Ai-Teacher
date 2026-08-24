'use client';

import { memo } from 'react';
import { Clock, X } from 'lucide-react';
import type { ScheduleItemCardNoticePopoverProps } from '../../types/schedule.types';

export const ScheduleItemCardNoticePopover = memo(function ScheduleItemCardNoticePopover({
  item,
  onClose,
}: ScheduleItemCardNoticePopoverProps) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute -top-14 right-6 z-40 bg-[#0B132B] border border-[#38BDF8]/60 text-white rounded-2xl p-2.5 shadow-2xl text-[11px] font-['Hanken_Grotesk',sans-serif] flex items-center gap-3 animate-in fade-in zoom-in-95 duration-150 border-t-2 border-t-[#38BDF8]"
    >
      <div className="p-1 rounded-lg bg-[#2563EB]/20 text-[#38BDF8] shrink-0">
        <Clock className="w-4 h-4" />
      </div>

      <div>
        <span className="font-bold text-[#38BDF8] text-[10px] uppercase tracking-wider block leading-tight">
          Class Not Active Right Now
        </span>
        <span className="text-[#E2E8F0] font-mono text-[10px]">
          Scheduled: <strong className="text-white">{item.dayOfWeek}</strong> @ <strong className="text-[#38BDF8]">{item.timeSlot || item.timeFormatted}</strong>
        </span>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-1 text-[#64748B] hover:text-white rounded-md transition-colors cursor-pointer shrink-0 ml-1"
        title="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

ScheduleItemCardNoticePopover.displayName = 'ScheduleItemCardNoticePopover';
