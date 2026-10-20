'use client';

import { memo } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { ClassBehaviorSectionProps } from '../../types/progress.types';

export const ClassBehaviorWarnings = memo(function ClassBehaviorWarnings({ metrics, banStatus, handleFineClick }: ClassBehaviorSectionProps) {
  const isBanned = banStatus.isBanned;
  return (
    <>
      {/* Disruption Warning Chances Counter (3 Max) */}
      <div
        className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isBanned
            ? 'bg-dashboard-danger/15 border-dashboard-danger/50'
            : 'bg-dashboard-panel border-dashboard-border'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isBanned ? 'bg-dashboard-danger text-white' : banStatus.currentWarnings > 0 ? 'bg-dashboard-warning/5 text-dashboard-warning' : 'bg-dashboard-subtle text-dashboard-muted'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-dashboard-text flex items-center gap-2 flex-wrap">
              <span>Rough Behavior / Disruption Chances</span>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border ${
                  isBanned
                    ? 'bg-dashboard-danger text-white border-dashboard-danger'
                    : banStatus.currentWarnings > 0 ? 'bg-dashboard-warning/5 text-dashboard-warning border-dashboard-warning/20' : 'bg-dashboard-subtle text-dashboard-muted border-dashboard-border'
                }`}
              >
                {banStatus.currentWarnings} / {banStatus.maxAllowed} Warning Chances Used
              </span>
            </h4>
            <p className="text-xs text-dashboard-muted mt-1.5 leading-relaxed">
              {metrics.lastIncidentNote || banStatus.banNotice}
            </p>
          </div>
        </div>

        {/* Action / Warning Notice */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleFineClick}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isBanned
                ? 'bg-dashboard-danger text-white border-dashboard-danger hover:bg-dashboard-danger'
                : 'bg-dashboard-subtle text-dashboard-muted border-dashboard-border hover:text-dashboard-text hover:bg-dashboard-subtle'
            }`}
          >
            {isBanned ? 'Banned - Payment Not Allowed' : 'Strict Conduct Rules'}
          </button>
        </div>
      </div>


    </>
  );
});

ClassBehaviorWarnings.displayName = 'ClassBehaviorWarnings';
