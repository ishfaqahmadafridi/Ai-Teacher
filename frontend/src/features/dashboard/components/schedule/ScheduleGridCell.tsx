'use client';

import { memo } from 'react';
import { Video } from 'lucide-react';
import type { ScheduleGridCellProps } from '../../types/schedule.types';

export const ScheduleGridCell = memo(function ScheduleGridCell({
  item,
  day,
  onJoinClass,
  className = '',
}: ScheduleGridCellProps) {
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

  return (
    <div
      className={`h-full rounded-2xl p-3.5 border transition-all flex flex-col justify-between group ${
        isLive
          ? 'bg-gradient-to-br from-[#EF4444]/20 to-[#1E1B4B] border-[#EF4444]/50 shadow-md'
          : 'bg-[#1E293B] border-[#334155] hover:border-[#38BDF8]/50'
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
          onClick={() => onJoinClass?.(item.id)}
          className={`px-2 py-1 rounded-lg text-white font-bold text-[10px] uppercase flex items-center gap-1 transition-colors shrink-0 cursor-pointer ${
            isLive ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
          }`}
          title="Join Session"
        >
          <Video className="w-3 h-3" />
          <span>Join</span>
        </button>
      </div>
    </div>
  );
});

ScheduleGridCell.displayName = 'ScheduleGridCell';
