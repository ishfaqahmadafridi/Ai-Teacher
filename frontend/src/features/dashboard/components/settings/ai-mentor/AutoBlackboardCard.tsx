'use client';

import { memo } from 'react';
import { Presentation } from 'lucide-react';
import type { AutoBlackboardCardProps } from '../../../types/settings.types';

export const AutoBlackboardCard = memo(function AutoBlackboardCard({
  autoBlackboardDiagrams,
  onToggleAutoBlackboard,
  className = '',
}: AutoBlackboardCardProps) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
          <Presentation aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text">Automated Blackboard Diagrams</h4>
          <p className="text-xs text-dashboard-muted">
            Auto-generate physics blackboard diagrams during live teacher explanations.
          </p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={autoBlackboardDiagrams}
        aria-label="Automated blackboard diagrams"
        onClick={onToggleAutoBlackboard}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-primary focus-visible:ring-offset-2 ${
          autoBlackboardDiagrams ? 'bg-dashboard-primary' : 'bg-dashboard-subtle'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-none ring-0 transition duration-200 ease-in-out ${
            autoBlackboardDiagrams ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
});

AutoBlackboardCard.displayName = 'AutoBlackboardCard';
