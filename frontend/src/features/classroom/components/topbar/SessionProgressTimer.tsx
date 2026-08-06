'use client';

import { memo } from 'react';
import { Clock } from 'lucide-react';
import type { SessionProgressTimerProps } from '../../types/topbar.types';

export const SessionProgressTimer = memo(function SessionProgressTimer({
  elapsedFormatted = '42:15',
  progressPercent = 35,
}: SessionProgressTimerProps) {
  const clampedProgress = Math.min(100, Math.max(0, progressPercent));

  return (
    <div className="hidden lg:flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2">
      <div className="flex items-center gap-3 bg-[#1e2024]/50 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 shadow-sm">
        {/* Animated Pulsing Timer Icon */}
        <div className="relative flex items-center justify-center w-5 h-5">
          <Clock className="w-5 h-5 text-[#4edea3] pulse-ring absolute" aria-hidden="true" />
          <Clock className="w-5 h-5 text-[#4edea3] relative z-10" aria-hidden="true" />
        </div>

        {/* Timer Text */}
        <span className="font-['Hanken_Grotesk',sans-serif] text-sm md:text-base text-[#e2e2e8] tracking-widest font-mono font-medium">
          {elapsedFormatted}
        </span>

        {/* Divider */}
        <div className="w-px h-4 bg-[#434656] mx-1" aria-hidden="true" />

        {/* Progress Bar & Percentage */}
        <div className="flex items-center gap-2">
          <span className="font-['Hanken_Grotesk',sans-serif] text-[11px] text-[#c4c5d9] uppercase tracking-wider font-semibold">
            Progress
          </span>
          <div className="w-20 md:w-24 h-1.5 bg-[#333539] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6ffbbe] rounded-full shadow-[0_0_8px_rgba(111,251,190,0.5)] transition-all duration-500 ease-out"
              style={{ width: `${clampedProgress}%` }}
              role="progressbar"
              aria-valuenow={clampedProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="font-['Hanken_Grotesk',sans-serif] text-xs font-semibold text-[#6ffbbe]">
            {clampedProgress}%
          </span>
        </div>
      </div>
    </div>
  );
});

SessionProgressTimer.displayName = 'SessionProgressTimer';
