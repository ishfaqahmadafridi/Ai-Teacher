'use client';

import { memo } from 'react';
import { Focus, MessagesSquare } from 'lucide-react';
import type { ClassBehaviorSectionProps } from '../../types/progress.types';

export const ClassBehaviorMetrics = memo(function ClassBehaviorMetrics({ metrics }: ClassBehaviorSectionProps) {
  return (
    <>
      {/* Behavior Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Focus Level */}
        <div className="bg-dashboard-panel p-4 rounded-2xl border border-dashboard-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-dashboard-muted font-medium flex items-center gap-1.5">
              <Focus className="w-4 h-4 text-dashboard-muted" />
              Focus Level Index
            </span>
            <span className="font-mono font-bold text-dashboard-text">
              {metrics.focusLevelPercent}%
            </span>
          </div>
          <div className="w-full bg-dashboard-subtle h-2 rounded-full overflow-hidden">
            <div
              className="bg-dashboard-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.focusLevelPercent}%` }}
            />
          </div>
        </div>

        {/* Interaction Quality */}
        <div className="bg-dashboard-panel p-4 rounded-2xl border border-dashboard-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-dashboard-muted font-medium flex items-center gap-1.5">
              <MessagesSquare className="w-4 h-4 text-dashboard-muted" />
              Interaction Quality
            </span>
            <span className="font-mono font-bold text-dashboard-text">
              {metrics.interactionQualityPercent}%
            </span>
          </div>
          <div className="w-full bg-dashboard-subtle h-2 rounded-full overflow-hidden">
            <div
              className="bg-dashboard-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.interactionQualityPercent}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
});

ClassBehaviorMetrics.displayName = 'ClassBehaviorMetrics';
