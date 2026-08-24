'use client';

import { memo } from 'react';
import { CheckCircle2, Hourglass } from 'lucide-react';
import type { ClassCardProgressBarProps } from '../../types/classes.types';

export const ClassCardProgressBar = memo(function ClassCardProgressBar({
  metrics,
  timeRemaining,
}: ClassCardProgressBarProps) {
  const { progress, completed, remaining, remainingPercent } = metrics;

  return (
    <div className="bg-[#0B132B]/80 rounded-xl p-3.5 border border-[#1E293B] space-y-2">
      <div className="flex items-center justify-between font-['JetBrains_Mono',monospace] text-xs">
        <span className="font-bold text-[#10B981] flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" aria-hidden="true" />
          Completed: {completed} ({progress}%)
        </span>
        <span className="font-bold text-[#F59E0B] flex items-center gap-1">
          <Hourglass className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />
          Remaining: {remaining} ({remainingPercent}%)
        </span>
      </div>

      {/* Segmented Dual Progress Bar */}
      <div className="w-full bg-[#1E293B] rounded-full h-2.5 flex overflow-hidden">
        <div
          className="bg-[#2563eb] h-full rounded-l-full transition-all duration-500"
          style={{ width: `${progress}%` }}
          title={`Completed Schedule: ${progress}% (${completed} Classes)`}
        />
        <div
          className="bg-[#F59E0B] h-full rounded-r-full transition-all duration-500 opacity-80"
          style={{ width: `${remainingPercent}%` }}
          title={`Remaining Schedule: ${remainingPercent}% (${remaining} Classes)`}
        />
      </div>

      {timeRemaining && (
        <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[#94A3B8] block text-right">
          {timeRemaining}
        </span>
      )}
    </div>
  );
});

ClassCardProgressBar.displayName = 'ClassCardProgressBar';
