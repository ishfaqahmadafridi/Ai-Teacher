'use client';

import { memo } from 'react';
import { ScheduleAttendanceBadge } from './ScheduleAttendanceBadge';
import { useScheduleItemCard } from '../../hooks/useScheduleItemCard';
import { ScheduleItemCardNoticePopover } from './ScheduleItemCardNoticePopover';
import { ScheduleItemCardBadges } from './ScheduleItemCardBadges';
import { ScheduleItemCardActionButton } from './ScheduleItemCardActionButton';
import type { ScheduleItemCardProps } from '../../types/schedule.types';

export const ScheduleItemCard = memo(function ScheduleItemCard(
  props: ScheduleItemCardProps
) {
  const { item, className = '' } = props;
  const { isLive, isJoinAvailable, isEnded, showNotice, handleClick, handleCloseNotice } =
    useScheduleItemCard(props);

  return (
    <div className="relative">
      {/* Small Inline Popover Notice Bubble */}
      {showNotice && (
        <ScheduleItemCardNoticePopover
          item={item}
          onClose={handleCloseNotice}
        />
      )}

      {/* Main Card Container */}
      <div
        onClick={handleClick}
        className={`relative bg-dashboard-panel border rounded-3xl p-6 transition-all duration-300 shadow-none group flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden cursor-pointer ${
          isLive
            ? 'border-dashboard-primary/40 bg-dashboard-panel'
            : 'border-dashboard-border hover:border-dashboard-primary/40 hover:shadow-none/5'
        } ${className}`}
      >
        {/* Background Glow */}
        {isLive && (
          <div className="absolute top-0 right-0 w-64 h-full bg-dashboard-primary/5 blur-3xl pointer-events-none" />
        )}

        <div className="flex-1 min-w-0 relative z-10">
          {/* Top Badges */}
          <ScheduleItemCardBadges item={item} isLive={isLive} />

          {/* Class Title */}
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-dashboard-text group-hover:text-dashboard-primary transition-colors leading-snug">
            {item.title}
          </h3>
        </div>

        {/* Action Button */}
        {isEnded ? <ScheduleAttendanceBadge item={{ ...item, sessionEnded: true }} /> : <ScheduleItemCardActionButton isLive={isLive} isJoinAvailable={isJoinAvailable} onClick={handleClick} />}
      </div>
    </div>
  );
});

ScheduleItemCard.displayName = 'ScheduleItemCard';
