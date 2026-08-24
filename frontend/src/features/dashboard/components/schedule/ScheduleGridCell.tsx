'use client';

import { memo, useState, useEffect } from 'react';
import { Video, Clock, X } from 'lucide-react';
import type { ScheduleGridCellProps } from '../../types/schedule.types';

export const ScheduleGridCell = memo(function ScheduleGridCell({
  item,
  day,
  onJoinClass,
  onSelectNoticeItem,
  className = '',
}: ScheduleGridCellProps) {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (showNotice) {
      const timer = setTimeout(() => setShowNotice(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [showNotice]);

  if (!item) {
    return (
      <div
        className={`h-full rounded-2xl bg-[#090D16]/50 border border-[#1E293B]/40 flex items-center justify-center text-xs text-[#475569] italic ${className}`}
      >
        —
      </div>
    );
  }

  const isLive = item.status === 'live';

  const handleClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isLive) {
      onJoinClass?.(item.id);
    } else {
      setShowNotice((prev) => !prev);
      onSelectNoticeItem?.(item);
    }
  };

  return (
    <div className="relative h-full">
      {/* Small Inline Popover Notice Message */}
      {showNotice && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 bg-[#0B132B] border border-[#38BDF8]/60 text-white rounded-2xl p-2.5 shadow-2xl text-[11px] font-['Hanken_Grotesk',sans-serif] flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-150 min-w-[220px] pointer-events-auto border-t-2 border-t-[#38BDF8]"
        >
          <div className="p-1 rounded-lg bg-[#2563EB]/20 text-[#38BDF8] shrink-0 mt-0.5">
            <Clock className="w-3.5 h-3.5" />
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <span className="font-bold text-[#38BDF8] text-[10px] uppercase tracking-wider block leading-tight">
              Class Not Live Right Now
            </span>
            <p className="text-[#94A3B8] text-[10px] font-mono mt-0.5 leading-snug">
              Scheduled for <strong className="text-white">{day}</strong> @ <strong className="text-[#38BDF8]">{item.timeSlot || item.timeFormatted}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNotice(false)}
            className="p-1 text-[#64748B] hover:text-white rounded-md transition-colors cursor-pointer shrink-0"
            title="Close message"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Pointer Arrow */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0B132B] border-r border-b border-[#38BDF8]/60 rotate-45" />
        </div>
      )}

      {/* Grid Cell Container */}
      <div
        onClick={handleClick}
        className={`h-full rounded-2xl p-3.5 border transition-all flex flex-col justify-between group cursor-pointer ${
          isLive
            ? 'bg-gradient-to-br from-[#EF4444]/20 to-[#1E1B4B] border-[#EF4444]/60 shadow-lg shadow-[#EF4444]/10 hover:border-[#EF4444]'
            : 'bg-[#1E293B] border-[#334155] hover:border-[#2563EB]/60 hover:bg-[#1E293B]/80'
        } ${className}`}
      >
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0F172A] text-[#38BDF8] border border-[#2563EB]/30 block truncate mb-1">
            {item.subject}
          </span>
          <h5 className="font-['Hanken_Grotesk',sans-serif] text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-[#38BDF8] transition-colors">
            {item.title}
          </h5>
        </div>

        <div className="mt-2 flex items-center justify-end">
          <button
            type="button"
            onClick={handleClick}
            className={`px-2 py-1 rounded-lg text-white font-bold text-[10px] uppercase flex items-center gap-1 transition-colors shrink-0 cursor-pointer ${
              isLive ? 'bg-[#EF4444] hover:bg-[#DC2626] shadow-md shadow-[#EF4444]/30' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
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
