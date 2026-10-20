'use client';

import { memo } from 'react';
import { Target, CalendarCheck, Flame } from 'lucide-react';
import type { AnalyticsSummaryItemProps } from '../../types/analytics.types';

export const AnalyticsSummaryItem = memo(function AnalyticsSummaryItem({ label, value, unit, description, iconName, progressPercent, className = '' }: AnalyticsSummaryItemProps) {
  const Icon = iconName === 'target' ? Target : iconName === 'calendar' ? CalendarCheck : Flame;
  return (
    <div className={`rounded-lg border border-dashboard-border/70 bg-dashboard-bg px-3.5 py-3 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-dashboard-muted" strokeWidth={1.75} aria-hidden="true" />
          <p className="text-xs font-medium leading-5 text-dashboard-text">{label}</p>
        </div>
        <p className="shrink-0 text-xl font-semibold leading-6 tabular-nums tracking-tight text-dashboard-text">{value}{unit && <span className="ml-0.5 text-xs font-normal tracking-normal text-dashboard-muted">{unit}</span>}</p>
      </div>
      {progressPercent !== undefined && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-dashboard-border" role="progressbar" aria-label={label} aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-dashboard-primary" style={{ width: `${progressPercent}%` }} />
        </div>
      )}
      <p className="mt-2 text-[11px] leading-5 text-dashboard-muted">{description}</p>
    </div>
  );
});
AnalyticsSummaryItem.displayName = 'AnalyticsSummaryItem';
