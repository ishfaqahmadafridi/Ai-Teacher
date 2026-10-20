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
      <div className="bg-white rounded-xl p-4 card-shadow border border-dashboard-border space-y-3 relative overflow-hidden group">
        {/* Live Status Badge Header */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-['JetBrains_Mono',monospace] text-[11px] font-bold text-dashboard-success bg-dashboard-success/10 border border-dashboard-success/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-dashboard-success animate-ping" />
            Live In 15 Mins
          </span>
          <span className="font-['JetBrains_Mono',monospace] text-[11px] font-semibold text-dashboard-muted">
            10:00 AM - 11:30 AM
          </span>
        </div>

        {/* Live Course Info */}
        <div>
          <h4 className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-dashboard-text group-hover:text-dashboard-primary transition-colors leading-snug">
            Physics 101: Newton&apos;s Second Law
          </h4>
          <p className="font-['Hanken_Grotesk',sans-serif] text-xs text-dashboard-muted">
            Instructor: Dr. Evelyn Vance
          </p>
        </div>

        {/* Join Live Room CTA Button */}
        <button
          type="button"
          className="w-full bg-dashboard-primary hover:bg-dashboard-primary-hover text-white py-2 rounded-lg font-['Hanken_Grotesk',sans-serif] font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-none active:scale-95 duration-200"
        >
          <Video className="w-3.5 h-3.5" aria-hidden="true" />
          Join Live Room
        </button>
      </div>

      {/* Bottom: Daily Academic Agenda & AI Insight */}
      <div className="bg-dashboard-subtle rounded-xl p-3 border border-dashboard-border space-y-2">
        <div className="flex items-center justify-between text-xs text-dashboard-muted">
          <span className="flex items-center gap-1.5 font-['JetBrains_Mono',monospace] text-[11px]">
            <Clock className="w-3.5 h-3.5 text-dashboard-warning" aria-hidden="true" />
            1 Homework Due Today
          </span>
          <span className="flex items-center gap-1.5 font-['JetBrains_Mono',monospace] text-[11px] text-dashboard-success font-semibold">
            <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
            96% Attendance
          </span>
        </div>

        {/* AI Tutor Tip */}
        <div className="pt-1.5 border-t border-dashboard-border/60 flex items-center gap-1.5 text-[11px] text-dashboard-primary font-semibold">
          <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">AI Tip: Review Vectors before 10:00 AM class</span>
        </div>
      </div>
    </div>
  );
});

LearningStreakCard.displayName = 'LearningStreakCard';
