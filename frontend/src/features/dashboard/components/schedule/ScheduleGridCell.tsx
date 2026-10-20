'use client';

import { memo } from 'react';
import { ScheduleAttendanceBadge } from './ScheduleAttendanceBadge';
import { Video, Clock3 } from 'lucide-react';
import { useScheduleGridCell } from '../../hooks/useScheduleGridCell';
import { ScheduleItemCardNoticePopover } from './ScheduleItemCardNoticePopover';
import type { ScheduleGridCellProps } from '../../types/schedule.types';

export const ScheduleGridCell = memo(function ScheduleGridCell({
  item,
  onJoinClass,
  onSelectNoticeItem,
  className = '',
}: ScheduleGridCellProps) {
  const { isLive, isJoinAvailable, isEnded, showNotice, handleClick, handleCloseNotice } =
    useScheduleGridCell({
      item,
      onJoinClass,
      onSelectNoticeItem,
    });

  if (!item) {
    return (
      <div
        role="cell"
        className={`h-full border-l border-dashboard-border bg-dashboard-panel flex items-center justify-center text-xs text-dashboard-muted italic ${className}`}
      >
        —
      </div>
    );
  }

  return (
    <div className="relative h-full border-l border-dashboard-border" role="cell">
      {/* Popover Notice Message */}
      {showNotice && (
        <ScheduleItemCardNoticePopover
          item={item}
          onClose={handleCloseNotice}
        />
      )}

      {/* Grid Cell Container */}
      <div
        className={`h-full p-4 transition-colors flex flex-col items-stretch justify-between gap-4 ${
          isLive
            ? 'bg-schedule-join-soft'
            : 'bg-dashboard-panel hover:bg-dashboard-bg'
        } ${className}`}
      >
        <div className="min-w-0 flex-1">
          <span className="text-xs font-medium text-dashboard-muted block truncate mb-1">
            {item.subject}
          </span>
          {!item.sessionEnded && <ScheduleAttendanceBadge item={item} />}
          <h5 title={item.title} className="font-['Hanken_Grotesk',sans-serif] text-sm font-medium text-dashboard-text line-clamp-2 leading-snug">
            {item.title}
          </h5>
        </div>

        <div className="flex shrink-0 items-center justify-start">
          {isEnded ? <ScheduleAttendanceBadge item={{ ...item, sessionEnded: true }} /> : <button
            type="button"
            onClick={handleClick}
            className={`inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-schedule-join focus-visible:ring-offset-2 ${
              isJoinAvailable
                ? 'border-schedule-join bg-schedule-join text-white hover:bg-schedule-join-hover'
                : 'border-transparent bg-transparent text-dashboard-muted hover:bg-dashboard-subtle hover:text-dashboard-text'
            }`}
            title={isJoinAvailable ? 'Join class' : 'View Schedule Time Notice'}
          >
            {isJoinAvailable ? <Video className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" /> : <Clock3 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />}
            <span>{isJoinAvailable ? 'Join class' : 'View time'}</span>
          </button>}
        </div>
      </div>
    </div>
  );
});

ScheduleGridCell.displayName = 'ScheduleGridCell';

