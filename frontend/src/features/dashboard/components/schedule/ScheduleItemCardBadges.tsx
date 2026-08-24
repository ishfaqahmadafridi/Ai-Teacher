'use client';

import { memo } from 'react';
import { Clock, Radio } from 'lucide-react';
import type { ScheduleItemCardBadgesProps } from '../../types/schedule.types';

export const ScheduleItemCardBadges = memo(function ScheduleItemCardBadges({
  item,
  isLive,
}: ScheduleItemCardBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-3">
      {/* Time Slot Badge */}
      <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/40 flex items-center gap-1.5 shadow-sm">
        <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
        {item.timeSlot || item.timeFormatted}
      </span>

      {/* Subject Badge */}
      <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#1E293B] text-[#94A3B8] border border-[#334155]">
        {item.subject}
      </span>

      {/* Live Status Badge */}
      {isLive && (
        <span className="text-[11px] font-extrabold px-3 py-1 rounded-xl bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 flex items-center gap-1.5 animate-pulse">
          <Radio className="w-3.5 h-3.5 text-[#EF4444]" />
          LIVE SESSION NOW
        </span>
      )}
    </div>
  );
});

ScheduleItemCardBadges.displayName = 'ScheduleItemCardBadges';
