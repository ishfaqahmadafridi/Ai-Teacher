'use client';

import { memo } from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
import type { ClassBehaviorSectionProps } from '../../types/progress.types';

export const ClassBehaviorHeader = memo(function ClassBehaviorHeader({ metrics, banStatus }: ClassBehaviorSectionProps) {
  const isBanned = banStatus.isBanned;
  return (
    <>
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashboard-border pb-5">
        <div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${
              isBanned
                ? 'bg-dashboard-danger/20 text-dashboard-danger border-dashboard-danger/30'
                : 'bg-dashboard-subtle text-dashboard-muted border-dashboard-border'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Live Class Behavior Tracker</span>
          </div>
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-dashboard-text">
            Class Conduct & Disruption History
          </h3>
        </div>

        {/* Conduct Score Badge */}
        <div className="flex items-center gap-3 bg-dashboard-panel p-3 rounded-2xl border border-dashboard-border">
          <div className="text-right">
            <div className="text-[10px] text-dashboard-muted font-bold uppercase tracking-wider">
              Conduct Score
            </div>
            <div
              className={`font-['JetBrains_Mono',monospace] text-xl font-bold ${
                isBanned ? 'text-dashboard-danger' : 'text-dashboard-text'
              }`}
            >
              {metrics.conductScore}%
            </div>
          </div>
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
              isBanned
                ? 'bg-dashboard-danger/20 border-dashboard-danger/40 text-dashboard-danger'
                : 'bg-dashboard-subtle border-dashboard-border text-dashboard-muted'
            }`}
          >
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>


    </>
  );
});

ClassBehaviorHeader.displayName = 'ClassBehaviorHeader';
