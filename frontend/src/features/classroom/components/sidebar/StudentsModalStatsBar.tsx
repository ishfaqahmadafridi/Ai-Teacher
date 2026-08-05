'use client';

import { memo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { StudentsModalStatsBarProps } from '../../types/sidebar.types';

export const StudentsModalStatsBar = memo(function StudentsModalStatsBar({
  total,
  present,
  absent,
  className = '',
}: StudentsModalStatsBarProps) {
  return (
    <div className={`grid grid-cols-3 gap-3 p-4 md:p-5 bg-white/5 border-b border-white/10 ${className}`}>
      {/* Total Students */}
      <div className="bg-[#111318]/60 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center">
        <span className="text-[10px] text-[#c4c5d9] uppercase tracking-wider font-semibold mb-0.5">
          Total Students
        </span>
        <span className="text-xl md:text-2xl font-bold font-mono text-[#e2e2e8]">
          {total}
        </span>
      </div>

      {/* Present */}
      <div className="bg-[#00a572]/10 border border-[#00a572]/30 rounded-xl p-3 flex flex-col items-center justify-center">
        <span className="text-[10px] text-[#6ffbbe] uppercase tracking-wider font-semibold mb-0.5 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-[#6ffbbe]" /> Present
        </span>
        <span className="text-xl md:text-2xl font-bold font-mono text-[#6ffbbe]">
          {present}
        </span>
      </div>

      {/* Absent */}
      <div className="bg-[#93000a]/10 border border-[#ffb4ab]/30 rounded-xl p-3 flex flex-col items-center justify-center">
        <span className="text-[10px] text-[#ffb4ab] uppercase tracking-wider font-semibold mb-0.5 flex items-center gap-1">
          <XCircle className="w-3 h-3 text-[#ffb4ab]" /> Absent
        </span>
        <span className="text-xl md:text-2xl font-bold font-mono text-[#ffb4ab]">
          {absent}
        </span>
      </div>
    </div>
  );
});

StudentsModalStatsBar.displayName = 'StudentsModalStatsBar';
