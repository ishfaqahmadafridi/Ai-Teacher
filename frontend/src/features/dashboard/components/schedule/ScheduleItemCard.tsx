'use client';

import { memo } from 'react';
import { Clock, Video, ArrowRight, Radio } from 'lucide-react';
import type { ScheduleItemCardProps } from '../../types/schedule.types';

export const ScheduleItemCard = memo(function ScheduleItemCard({
  item,
  onJoinClass,
  className = '',
}: ScheduleItemCardProps) {
  const isLive = item.status === 'live';

  return (
    <div
      className={`relative bg-[#0F172A] border rounded-3xl p-6 transition-all duration-300 shadow-xl group flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden ${
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

        {/* Class Title */}
        <h3 className="font-['Hanken_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
          {item.title}
        </h3>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={() => onJoinClass?.(item.id)}
        className={`w-full md:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 border shadow-lg cursor-pointer shrink-0 relative z-10 ${
          isLive
            ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white border-[#EF4444] shadow-[#EF4444]/30 animate-pulse'
            : 'bg-[#1E293B] hover:bg-[#2563EB] text-white border-[#334155] hover:border-[#38BDF8]/50'
        }`}
      >
        <Video className="w-4 h-4 text-white" />
        <span>{isLive ? 'Join Live Stream' : 'Join Session'}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
});

ScheduleItemCard.displayName = 'ScheduleItemCard';
