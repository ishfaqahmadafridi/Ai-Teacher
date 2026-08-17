'use client';

import { memo } from 'react';
import type { AcademicProgressHeaderProps } from '../../types';

function AcademicProgressHeaderComponent({ className = '' }: AcademicProgressHeaderProps) {
  return (
    <div className={`flex items-center gap-3 font-['JetBrains_Mono',monospace] ${className}`}>
      <span className="px-3 py-1 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
        Step 5 of 6
      </span>
      <span className="text-xs text-[#94A3B8] font-medium uppercase tracking-widest">
        Academic Progression
      </span>
    </div>
  );
}

export const AcademicProgressHeader = memo(AcademicProgressHeaderComponent);
AcademicProgressHeader.displayName = 'AcademicProgressHeader';
