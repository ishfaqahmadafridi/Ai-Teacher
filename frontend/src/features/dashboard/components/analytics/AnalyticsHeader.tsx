'use client';

import { memo } from 'react';
import type { AnalyticsHeaderProps } from '../../types/analytics.types';

export const AnalyticsHeader = memo(function AnalyticsHeader({
  activeTimeframe,
  onSelectTimeframe,
  className = '',
}: AnalyticsHeaderProps) {
  return (
    <div className={`relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}>
      <div>
        <div className="flex items-center gap-2.5">
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-xl font-extrabold text-white tracking-tight">
            Overall Performance Analytics
          </h3>
          <span className="font-['JetBrains_Mono',monospace] text-[11px] font-bold text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Top 5% Student
          </span>
        </div>
        <p className="text-xs text-[#94A3B8] mt-1">
          Real-time track of attendance, focus metrics, and academic achievement scores.
        </p>
      </div>

      {/* Timeframe Selector Buttons */}
      <div className="flex items-center gap-1.5 bg-[#070D1A] p-1 rounded-xl border border-[#1E293B] self-start sm:self-auto shrink-0">
        <button
          type="button"
          onClick={() => onSelectTimeframe('week')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTimeframe === 'week'
              ? 'bg-[#2563EB] text-white shadow-md'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          Weekly
        </button>
        <button
          type="button"
          onClick={() => onSelectTimeframe('month')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTimeframe === 'month'
              ? 'bg-[#2563EB] text-white shadow-md'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          Monthly
        </button>
      </div>
    </div>
  );
});

AnalyticsHeader.displayName = 'AnalyticsHeader';
