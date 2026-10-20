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
    <div className="bg-dashboard-panel/80 rounded-xl p-3.5 border border-dashboard-border space-y-2">
      <div className="flex items-center justify-between font-['JetBrains_Mono',monospace] text-xs">
        <span className="font-bold text-dashboard-success flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-dashboard-success" aria-hidden="true" />
          Completed: {completed} ({progress}%)
        </span>
        <span className="font-bold text-dashboard-warning flex items-center gap-1">
          <Hourglass className="w-3.5 h-3.5 text-dashboard-warning" aria-hidden="true" />
          Remaining: {remaining} ({remainingPercent}%)
        </span>
      </div>

      {/* Segmented Dual Progress Bar */}
      <div className="w-full bg-dashboard-subtle rounded-full h-2.5 flex overflow-hidden">
        <div
          className="bg-dashboard-primary h-full rounded-l-full transition-all duration-500"
          style={{ width: `${progress}%` }}
          title={`Completed Schedule: ${progress}% (${completed} Classes)`}
        />
        <div
          className="bg-dashboard-warning h-full rounded-r-full transition-all duration-500 opacity-80"
          style={{ width: `${remainingPercent}%` }}
          title={`Remaining Schedule: ${remainingPercent}% (${remaining} Classes)`}
        />
      </div>

      {timeRemaining && (
        <span className="font-['JetBrains_Mono',monospace] text-[10px] text-dashboard-muted block text-right">
          {timeRemaining}
        </span>
      )}
    </div>
  );
});

ClassCardProgressBar.displayName = 'ClassCardProgressBar';
