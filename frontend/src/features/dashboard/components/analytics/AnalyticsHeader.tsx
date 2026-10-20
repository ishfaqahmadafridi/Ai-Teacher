'use client';

import { memo } from 'react';
import type { AnalyticsHeaderProps } from '../../types/analytics.types';

export const AnalyticsHeader = memo(function AnalyticsHeader({
  activeTimeframe,
  onSelectTimeframe,
  className = '',
}: AnalyticsHeaderProps) {
  return (
    <div className={`relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}>
      <div>
        <div className="flex items-center gap-2.5">
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-lg font-semibold text-dashboard-text tracking-tight">
            Your progress
          </h3>

        </div>
        <p className="text-xs text-dashboard-muted mt-1">
          Goals, attendance, and your learning activity.
        </p>
      </div>

      {/* Timeframe Selector Buttons */}
      <div className="flex items-center gap-1 bg-dashboard-subtle p-1 rounded-lg self-start sm:self-auto shrink-0">
        <button
          type="button"
          onClick={() => onSelectTimeframe('week')}
          aria-pressed={activeTimeframe === 'week'}
          className={`dashboard-button dashboard-button-segment ${
            activeTimeframe === 'week'
              ? 'bg-dashboard-panel text-dashboard-primary shadow-sm'
              : 'text-dashboard-muted hover:text-dashboard-text'
          }`}
        >
          Weekly
        </button>
        <button
          type="button"
          onClick={() => onSelectTimeframe('month')}
          aria-pressed={activeTimeframe === 'month'}
          className={`dashboard-button dashboard-button-segment ${
            activeTimeframe === 'month'
              ? 'bg-dashboard-panel text-dashboard-primary shadow-sm'
              : 'text-dashboard-muted hover:text-dashboard-text'
          }`}
        >
          Monthly
        </button>
      </div>
    </div>
  );
});

AnalyticsHeader.displayName = 'AnalyticsHeader';
