'use client';

import { memo } from 'react';
import { Video, Clock, UserCheck, Sparkles } from 'lucide-react';
import type { ProgressAnalyticsCardProps } from '../../types/dashboard.types';

export const LearningStreakCard = memo(function LearningStreakCard({
  className = '',
}: ProgressAnalyticsCardProps) {
  return (
    <div className={`flex flex-col gap-3 w-full font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* Top: Upcoming Live Class Countdown Box */}
      <div className="bg-white rounded-xl p-4 card-shadow border border-[#E2E8F0] space-y-3 relative overflow-hidden group">
        {/* Live Status Badge Header */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-['JetBrains_Mono',monospace] text-[11px] font-bold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            Live In 15 Mins
          </span>
          <span className="font-['JetBrains_Mono',monospace] text-[11px] font-semibold text-[#737686]">
            10:00 AM - 11:30 AM
          </span>
        </div>

        {/* Live Course Info */}
        <div>
          <h4 className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-[#0F172A] group-hover:text-[#2563eb] transition-colors leading-snug">
            Physics 101: Newton's Second Law
          </h4>
          <p className="font-['Hanken_Grotesk',sans-serif] text-xs text-[#737686]">
            Instructor: Dr. Evelyn Vance
          </p>
        </div>

        {/* Join Live Room CTA Button */}
        <button
          type="button"
          className="w-full bg-[#2563eb] hover:bg-[#004ac6] text-white py-2 rounded-lg font-['Hanken_Grotesk',sans-serif] font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95 duration-200"
        >
          <Video className="w-3.5 h-3.5" aria-hidden="true" />
          Join Live Room
        </button>
      </div>

      {/* Bottom: Daily Academic Agenda & AI Insight */}
      <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0] space-y-2">
        <div className="flex items-center justify-between text-xs text-[#475569]">
          <span className="flex items-center gap-1.5 font-['JetBrains_Mono',monospace] text-[11px]">
            <Clock className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />
            1 Homework Due Today
          </span>
          <span className="flex items-center gap-1.5 font-['JetBrains_Mono',monospace] text-[11px] text-[#10B981] font-semibold">
            <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
            96% Attendance
          </span>
        </div>

        {/* AI Tutor Tip */}
        <div className="pt-1.5 border-t border-[#E2E8F0]/60 flex items-center gap-1.5 text-[11px] text-[#712ae2] font-semibold">
          <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">AI Tip: Review Vectors before 10:00 AM class</span>
        </div>
      </div>
    </div>
  );
});

LearningStreakCard.displayName = 'LearningStreakCard';
