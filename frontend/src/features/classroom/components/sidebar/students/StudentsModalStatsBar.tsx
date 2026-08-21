'use client';

import { memo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { StudentsModalStatsBarProps } from '../../../types/sidebar.types';

export const StudentsModalStatsBar = memo(function StudentsModalStatsBar({
  total,
  present,
  absent,
  className = '',
}: StudentsModalStatsBarProps) {
  return (
    <div className={`grid grid-cols-3 gap-3 p-4 md:p-5 bg-white/5 border-b border-white/10 ${className}`}>
      {/* Total Students */}
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
        <span className="font-['Hanken_Grotesk',sans-serif] text-[11px] font-semibold text-[#c4c5d9] uppercase tracking-wider">
          Total Enrolled
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-white">
            {total}
          </span>
          <span className="text-[10px] text-[#c4c5d9]">Students</span>
        </div>
      </div>

      {/* Present Students */}
      <div className="p-3 rounded-xl bg-[#6ffbbe]/10 border border-[#6ffbbe]/20 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-['Hanken_Grotesk',sans-serif] text-[11px] font-semibold text-[#6ffbbe] uppercase tracking-wider">
            Present
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-[#6ffbbe]" aria-hidden="true" />
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-[#6ffbbe]">
            {present}
          </span>
          <span className="text-[10px] text-[#6ffbbe]/80">Online</span>
        </div>
      </div>

      {/* Absent Students */}
      <div className="p-3 rounded-xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-['Hanken_Grotesk',sans-serif] text-[11px] font-semibold text-[#ffb4ab] uppercase tracking-wider">
            Absent
          </span>
          <XCircle className="w-3.5 h-3.5 text-[#ffb4ab]" aria-hidden="true" />
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-[#ffb4ab]">
            {absent}
          </span>
          <span className="text-[10px] text-[#ffb4ab]/80">Offline</span>
        </div>
      </div>
    </div>
  );
});

StudentsModalStatsBar.displayName = 'StudentsModalStatsBar';
