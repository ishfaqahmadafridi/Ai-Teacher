'use client';

import { memo } from 'react';
import { PlayCircle } from 'lucide-react';
import type { ContinueLearningBannerProps } from '../../types/dashboard.types';

export const ContinueLearningBanner = memo(function ContinueLearningBanner({
  course,
  onResume,
  className = '',
}: ContinueLearningBannerProps) {
  const clampedProgress = Math.min(100, Math.max(0, course.progressPercent));

  return (
    <div
      className={`bg-[#0F172A]/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {/* Left Icon & Details */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-12 h-12 rounded-xl bg-[#712ae2]/20 border border-[#712ae2]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
          <PlayCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-base font-semibold text-white truncate">
            Continue Learning: {course.title}
          </h3>
          <p className="font-['Hanken_Grotesk',sans-serif] text-sm text-[#94A3B8] truncate">
            {course.chapter}
          </p>
        </div>
      </div>

      {/* Right Progress & Resume Action */}
      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
        <div className="hidden sm:flex flex-col items-end">
          <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#38BDF8] uppercase tracking-wider mb-1">
            {clampedProgress}% PROGRESS
          </span>
          <div className="w-32 bg-[#1E293B] rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#2563eb] to-[#38BDF8] h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${clampedProgress}%` }}
              role="progressbar"
              aria-valuenow={clampedProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onResume}
          className="bg-[#2563eb] hover:bg-[#004ac6] text-white px-6 py-2 rounded-xl font-['Hanken_Grotesk',sans-serif] font-semibold text-sm shadow-md transition-colors cursor-pointer shrink-0 active:scale-95 duration-200"
        >
          Resume
        </button>
      </div>
    </div>
  );
});

ContinueLearningBanner.displayName = 'ContinueLearningBanner';
