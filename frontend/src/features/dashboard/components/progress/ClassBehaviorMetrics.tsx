'use client';

import { memo } from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import type { ClassBehaviorSectionProps } from '../../types/progress.types';

export const ClassBehaviorMetrics = memo(function ClassBehaviorMetrics({ metrics }: ClassBehaviorSectionProps) {
  return (
    <>
      {/* Behavior Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Focus Level */}
        <div className="bg-[#090D16] p-4 rounded-2xl border border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94A3B8] font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
              Focus Level Index
            </span>
            <span className="font-mono font-bold text-[#38BDF8]">
              {metrics.focusLevelPercent}%
            </span>
          </div>
          <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#2563EB] to-[#38BDF8] h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.focusLevelPercent}%` }}
            />
          </div>
        </div>

        {/* Interaction Quality */}
        <div className="bg-[#090D16] p-4 rounded-2xl border border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94A3B8] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              Interaction Quality
            </span>
            <span className="font-mono font-bold text-[#10B981]">
              {metrics.interactionQualityPercent}%
            </span>
          </div>
          <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#059669] to-[#10B981] h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.interactionQualityPercent}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
});

ClassBehaviorMetrics.displayName = 'ClassBehaviorMetrics';
