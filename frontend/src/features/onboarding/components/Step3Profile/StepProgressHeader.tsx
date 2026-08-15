'use client';

import { memo } from 'react';
import type { StepProgressHeaderProps } from '../../types';

function StepProgressHeaderComponent({ className = '' }: Partial<StepProgressHeaderProps>) {
  return (
    <div className={`flex items-center gap-3 font-['JetBrains_Mono',monospace] ${className}`}>
      <span className="px-3 py-1 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
        Step 3 of 6
      </span>
      <span className="text-xs text-[#94A3B8] font-medium uppercase tracking-widest">
        Student Profile Setup
      </span>
    </div>
  );
}

export const StepProgressHeader = memo(StepProgressHeaderComponent);
StepProgressHeader.displayName = 'StepProgressHeader';
