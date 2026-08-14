'use client';

import { memo } from 'react';
import { GraduationCap } from 'lucide-react';
import type { ContinueLearningBannerProps } from '../../types/dashboard.types';

export const ContinueLearningBanner = memo(function ContinueLearningBanner({
  course,
  onResume,
  className = '',
}: ContinueLearningBannerProps) {
  return (
    <div
      className={`bg-[#0F172A]/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-[#1E293B] flex items-center justify-between gap-4 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {/* Left Icon & Field Name */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-[#712ae2]/20 border border-[#712ae2]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
          <GraduationCap className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <span className="font-['JetBrains_Mono',monospace] text-[11px] font-bold text-[#38BDF8] uppercase tracking-wider block mb-0.5">
            Active Learning Field
          </span>
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-base sm:text-lg font-bold text-white truncate">
            {course.title}
          </h3>
        </div>
      </div>

      {/* Right Action Button */}
      <button
        type="button"
        onClick={onResume}
        className="bg-[#2563eb] hover:bg-[#004ac6] text-white px-6 py-2.5 rounded-xl font-['Hanken_Grotesk',sans-serif] font-semibold text-sm shadow-md transition-colors cursor-pointer shrink-0 active:scale-95 duration-200"
      >
        Resume Field
      </button>
    </div>
  );
});

ContinueLearningBanner.displayName = 'ContinueLearningBanner';
