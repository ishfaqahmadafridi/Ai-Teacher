'use client';

import { memo } from 'react';
import type { PaceDurationToggleProps } from '../../../types';

export const PaceDurationToggle = memo(function PaceDurationToggle({
  paceMode,
  onTogglePaceMode,
}: PaceDurationToggleProps) {
  return (
    <div className="bg-[#0A1120] p-1 rounded-xl border border-[#1E293B] flex items-center justify-between text-xs font-semibold relative z-10">
      <button
        type="button"
        onClick={() => onTogglePaceMode('4_months')}
        className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
          paceMode === '4_months'
            ? 'bg-[#2563EB]/40 text-[#38BDF8] font-bold border border-[#2563EB]/50'
            : 'text-[#94A3B8] hover:text-white'
        }`}
      >
        4-Month Plan
      </button>
      <button
        type="button"
        onClick={() => onTogglePaceMode('2_months')}
        className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
          paceMode === '2_months'
            ? 'bg-[#2563EB]/40 text-[#38BDF8] font-bold border border-[#2563EB]/50'
            : 'text-[#94A3B8] hover:text-white'
        }`}
      >
        2-Month Fast
      </button>
    </div>
  );
});

PaceDurationToggle.displayName = 'PaceDurationToggle';
