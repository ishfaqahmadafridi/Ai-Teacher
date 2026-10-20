'use client';

import { formatScheduleItemTime } from '../../utilities/scheduleTimeFormat';

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
      className="absolute -top-14 right-6 z-40 bg-dashboard-panel border border-dashboard-primary/60 text-dashboard-text rounded-2xl p-2.5 shadow-none text-[11px] font-['Hanken_Grotesk',sans-serif] flex items-center gap-3 animate-in fade-in zoom-in-95 duration-150 border-t-2 border-t-[#38BDF8]"
    >
      <div className="p-1 rounded-lg bg-dashboard-primary/20 text-dashboard-primary shrink-0">
        <Clock className="w-4 h-4" />
      </div>

      <div>
        <span className="font-bold text-dashboard-primary text-[10px] uppercase tracking-wider block leading-tight">
          Class Not Active Right Now
        </span>
        <span className="text-dashboard-text font-mono text-[10px]">
          Scheduled: <strong className="text-dashboard-text">{item.dayOfWeek}</strong> @ <strong className="text-dashboard-primary">{formatScheduleItemTime(item)}</strong>
        </span>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-1 text-dashboard-muted hover:text-dashboard-text rounded-md transition-colors cursor-pointer shrink-0 ml-1"
        title="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

ScheduleItemCardNoticePopover.displayName = 'ScheduleItemCardNoticePopover';
