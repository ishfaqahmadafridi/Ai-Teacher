'use client';

import { memo } from 'react';
import { UserCheck } from 'lucide-react';
import type { AnalyticsGaugeSectionProps } from '../../types/analytics.types';

export const AnalyticsGaugeSection = memo(function AnalyticsGaugeSection({
  weeklyProgressPercent,
  attendancePercent,
  classesAttended,
  totalClasses,
  className = '',
}: AnalyticsGaugeSectionProps) {
  const clampedProgress = Math.min(100, Math.max(0, weeklyProgressPercent));

  return (
    <div className={`flex flex-col items-center justify-center space-y-5 ${className}`}>
      {/* Circular Donut Gauge */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]" viewBox="0 0 36 36">
          <path
            className="text-[#162238]"
            strokeWidth="3.2"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-[#38BDF8] transition-all duration-1000 ease-out"
            strokeDasharray={`${clampedProgress}, 100`}
            strokeWidth="3.2"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-['Hanken_Grotesk',sans-serif] text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
            {clampedProgress}%
          </span>
          <span className="font-['JetBrains_Mono',monospace] text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest mt-0.5">
            Completed
          </span>
        </div>
      </div>

      {/* Attendance Rate Progress Bar */}
      <div className="w-full bg-[#0A1120] rounded-xl p-3.5 border border-[#1E293B] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#10B981]" aria-hidden="true" />
            <span className="font-['JetBrains_Mono',monospace] font-bold text-white uppercase tracking-wider">
              Attendance Rate
            </span>
          </div>
          <span className="font-['JetBrains_Mono',monospace] font-bold text-[#10B981]">
            {attendancePercent}% ({classesAttended}/{totalClasses} Classes)
          </span>
        </div>
        <div className="w-full bg-[#162238] rounded-full h-2 overflow-hidden p-0.5 border border-[#1E293B]">
          <div
            className="bg-gradient-to-r from-[#059669] to-[#10B981] h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            style={{ width: `${attendancePercent}%` }}
            role="progressbar"
            aria-valuenow={attendancePercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  );
});

AnalyticsGaugeSection.displayName = 'AnalyticsGaugeSection';
