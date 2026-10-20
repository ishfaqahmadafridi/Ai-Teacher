'use client';

import { memo } from 'react';
import type { ClassCardHeaderProps } from '../../types/classes.types';

export const ClassCardHeader = memo(function ClassCardHeader({
  subject,
  isLive,
}: ClassCardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 mb-3">
      <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold px-2.5 py-1 rounded-full bg-dashboard-primary/20 text-dashboard-primary border border-dashboard-primary/30">
        {subject}
      </span>
      {isLive ? (
        <span className="flex items-center gap-1.5 font-['JetBrains_Mono',monospace] text-[11px] font-bold text-dashboard-success bg-dashboard-success/20 border border-dashboard-success/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-dashboard-success animate-ping" />
          Live Now
        </span>
      ) : (
        <span className="font-['JetBrains_Mono',monospace] text-[11px] font-medium text-dashboard-muted bg-dashboard-subtle px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
          Scheduled
        </span>
      )}
    </div>
  );
});

ClassCardHeader.displayName = 'ClassCardHeader';
