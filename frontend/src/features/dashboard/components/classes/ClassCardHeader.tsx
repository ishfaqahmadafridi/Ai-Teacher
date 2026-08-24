'use client';

import { memo } from 'react';
import type { ClassCardHeaderProps } from '../../types/classes.types';

export const ClassCardHeader = memo(function ClassCardHeader({
  subject,
  isLive,
}: ClassCardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 mb-3">
      <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold px-2.5 py-1 rounded-full bg-[#2563eb]/20 text-[#38BDF8] border border-[#2563eb]/30">
        {subject}
      </span>
      {isLive ? (
        <span className="flex items-center gap-1.5 font-['JetBrains_Mono',monospace] text-[11px] font-bold text-[#10B981] bg-[#10B981]/20 border border-[#10B981]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
          Live Now
        </span>
      ) : (
        <span className="font-['JetBrains_Mono',monospace] text-[11px] font-medium text-[#94A3B8] bg-[#1E293B] px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
          Scheduled
        </span>
      )}
    </div>
  );
});

ClassCardHeader.displayName = 'ClassCardHeader';
