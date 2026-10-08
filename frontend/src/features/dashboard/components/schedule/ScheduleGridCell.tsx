'use client';

import { memo } from 'react';
import { Video } from 'lucide-react';
import { useScheduleGridCell } from '../../hooks/useScheduleGridCell';
import { ScheduleItemCardNoticePopover } from './ScheduleItemCardNoticePopover';
import type { ScheduleGridCellProps } from '../../types/schedule.types';

export const ScheduleGridCell = memo(function ScheduleGridCell({
  item,
  onJoinClass,
  onSelectNoticeItem,
  className = '',
}: ScheduleGridCellProps) {
  const { isLive, showNotice, handleClick, handleCloseNotice } =
    useScheduleGridCell({
      item,
      onJoinClass,
      onSelectNoticeItem,
    });

  if (!item) {
    return (
      <div
        className={`h-full rounded-xl bg-[#090D16]/50 border border-[#1E293B]/40 flex items-center justify-center text-xs text-[#475569] italic ${className}`}
      >
        —
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Popover Notice Message */}
      {showNotice && (
        <ScheduleItemCardNoticePopover
          item={item}
          onClose={handleCloseNotice}
        />
      )}

      {/* Grid Cell Container */}
      <div
        onClick={handleClick}
        className={`h-full rounded-xl px-3 py-2.5 border transition-all flex items-center gap-3 group cursor-pointer ${
          isLive
            ? 'bg-gradient-to-br from-[#EF4444]/20 to-[#1E1B4B] border-[#EF4444]/60 shadow-lg shadow-[#EF4444]/10 hover:border-[#EF4444]'
            : 'bg-slate-800/50 border-slate-700/50 hover:border-sky-500/50 hover:bg-slate-800/80'
        } ${className}`}
      >
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-medium text-sky-400 block truncate mb-1">
            {item.subject}
          </span>
          <h5 title={item.title} className="font-['Hanken_Grotesk',sans-serif] text-xs font-medium text-slate-100 line-clamp-2 leading-snug group-hover:text-[#38BDF8] transition-colors">
            {item.title}
          </h5>
        </div>

        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={handleClick}
            className={`px-2.5 py-1.5 rounded-md text-white font-medium text-xs flex items-center gap-1 transition-colors shrink-0 cursor-pointer ${
              isLive
                ? 'bg-[#EF4444] hover:bg-[#DC2626] shadow-md shadow-[#EF4444]/30'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
            }`}
            title={isLive ? 'Join Live Room' : 'View Schedule Time Notice'}
          >
            <Video className="w-3 h-3" />
            <span>Join</span>
          </button>
        </div>
      </div>
    </div>
  );
});

ScheduleGridCell.displayName = 'ScheduleGridCell';

