'use client';

import { memo } from 'react';
import { useScheduleItemCard } from '../../hooks/useScheduleItemCard';
import { ScheduleItemCardNoticePopover } from './ScheduleItemCardNoticePopover';
import { ScheduleItemCardBadges } from './ScheduleItemCardBadges';
import { ScheduleItemCardActionButton } from './ScheduleItemCardActionButton';
import type { ScheduleItemCardProps } from '../../types/schedule.types';

export const ScheduleItemCard = memo(function ScheduleItemCard(
  props: ScheduleItemCardProps
) {
  const { item, className = '' } = props;
  const { isLive, showNotice, handleClick, handleCloseNotice } =
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
        className={`relative bg-[#0F172A] border rounded-3xl p-6 transition-all duration-300 shadow-xl group flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden cursor-pointer ${
          isLive
            ? 'border-[#EF4444]/50 shadow-[#EF4444]/10 bg-gradient-to-r from-[#0F172A] via-[#1E1B4B]/40 to-[#0F172A]'
            : 'border-[#1E293B] hover:border-[#38BDF8]/40 hover:shadow-[#38BDF8]/5'
        } ${className}`}
      >
        {/* Background Glow */}
        {isLive && (
          <div className="absolute top-0 right-0 w-64 h-full bg-[#EF4444]/10 blur-3xl pointer-events-none" />
        )}

        <div className="flex-1 min-w-0 relative z-10">
          {/* Top Badges */}
          <ScheduleItemCardBadges item={item} isLive={isLive} />

          {/* Class Title */}
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
            {item.title}
          </h3>
        </div>

        {/* Action Button */}
        <ScheduleItemCardActionButton isLive={isLive} onClick={handleClick} />
      </div>
    </div>
  );
});

ScheduleItemCard.displayName = 'ScheduleItemCard';
