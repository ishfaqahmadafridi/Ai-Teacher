'use client';

import { memo } from 'react';
import { Flame, Clock, Award } from 'lucide-react';
import type { AnalyticsStreakFooterProps } from '../../types/analytics.types';

export const AnalyticsStreakFooter = memo(function AnalyticsStreakFooter({
  streakDays,
  className = '',
}: AnalyticsStreakFooterProps) {
  return (
    <div
      className={`relative z-10 bg-gradient-to-r from-[#070D1A] via-[#0B1426] to-[#070D1A] rounded-2xl p-4 border border-[#1E293B] shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-4 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {/* 1. Active Streak Badge */}
      <div className="flex items-center gap-3">
        <div className="w-9.5 h-9.5 rounded-xl bg-[#F59E0B]/20 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] shrink-0">
          <Flame className="w-5 h-5 fill-current animate-pulse" aria-hidden="true" />
        </div>
        <div>
          <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#94A3B8] uppercase block">
            Current Learning Streak
          </span>
          <span className="font-['JetBrains_Mono',monospace] text-sm font-bold text-white">
            {streakDays} Days Active 🔥
          </span>
        </div>
      </div>

      {/* 2. Weekly Study Goal Progress Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="w-9.5 h-9.5 rounded-xl bg-[#2563EB]/20 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
          <Clock className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#94A3B8] uppercase">
              Weekly Study Goal
            </span>
            <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#38BDF8]">
              15 / 20 Hrs (75%)
            </span>
          </div>
          <div className="w-full bg-[#162238] rounded-full h-2 overflow-hidden border border-[#1E293B]">
            <div
              className="bg-gradient-to-r from-[#2563EB] to-[#38BDF8] h-full rounded-full transition-all duration-700"
              style={{ width: '75%' }}
            />
          </div>
        </div>
      </div>

      {/* 3. Mastery Status Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9.5 h-9.5 rounded-xl bg-[#10B981]/20 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0">
          <Award className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#94A3B8] uppercase block">
            Academic Status
          </span>
          <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#10B981]">
            Advanced Mastery
          </span>
        </div>
      </div>
    </div>
  );
});

AnalyticsStreakFooter.displayName = 'AnalyticsStreakFooter';
