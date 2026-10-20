'use client';

import { formatScheduleItemTime } from '../../utilities/scheduleTimeFormat';

import { memo } from 'react';
import { ScheduleAttendanceBadge } from './ScheduleAttendanceBadge';
import { Clock, Radio } from 'lucide-react';
import type { ScheduleItemCardBadgesProps } from '../../types/schedule.types';

export const ScheduleItemCardBadges = memo(function ScheduleItemCardBadges({
  item,
  isLive,
}: ScheduleItemCardBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-3">
      {/* Time Slot Badge */}
      <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-dashboard-primary/20 text-dashboard-primary border border-dashboard-primary/40 flex items-center gap-1.5 shadow-none">
        <Clock className="w-3.5 h-3.5 text-dashboard-primary" />
        {formatScheduleItemTime(item)}
      </span>

      {/* Subject Badge */}
      <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-dashboard-subtle text-dashboard-muted border border-dashboard-border">
        {item.subject}
      </span>

      {!item.sessionEnded && <ScheduleAttendanceBadge item={item} />}
      {/* Live Status Badge */}
      {isLive && (
        <span className="text-[11px] font-extrabold px-3 py-1 rounded-xl bg-dashboard-primary/10 text-dashboard-primary border border-dashboard-primary/20 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-dashboard-primary" aria-hidden="true" />
          LIVE SESSION NOW
        </span>
      )}
    </div>
  );
});

ScheduleItemCardBadges.displayName = 'ScheduleItemCardBadges';
