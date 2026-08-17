'use client';

import { memo } from 'react';
import type { InterestsProgressHeaderProps } from '../../types';

function InterestsProgressHeaderComponent({ className = '' }: InterestsProgressHeaderProps) {
  return (
    <div className={`flex items-center gap-3 font-['JetBrains_Mono',monospace] ${className}`}>
      <span className="px-3 py-1 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
        Step 6 of 6
      </span>
      <span className="text-xs text-[#94A3B8] font-medium uppercase tracking-widest">
        Final Step: Academic Interests
      </span>
    </div>
  );
}

export const InterestsProgressHeader = memo(InterestsProgressHeaderComponent);
InterestsProgressHeader.displayName = 'InterestsProgressHeader';
