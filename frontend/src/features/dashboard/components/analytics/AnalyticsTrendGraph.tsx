'use client';

import { memo, useId } from 'react';
import { useAnalyticsTrendGraph } from '../../hooks/useAnalyticsTrendGraph';
import { ANALYTICS_SCORE_TICKS, ANALYTICS_WEEK_LABELS, ANALYTICS_MONTH_LABELS } from '../../constants/analyticsConstants';
import type { AnalyticsTrendGraphProps } from '../../types/analytics.types';

export const AnalyticsTrendGraph = memo(function AnalyticsTrendGraph({ trendData, activeTimeframe = 'week', className = '' }: AnalyticsTrendGraphProps) {
  const gradientId = useId();
  const { points, pathD, peakScore } = useAnalyticsTrendGraph(trendData);
  const labels = points.length > 0 ? points.map((point) => point.day) : activeTimeframe === 'week' ? ANALYTICS_WEEK_LABELS : ANALYTICS_MONTH_LABELS;
  return (
    <section className={`min-w-0 ${className}`} aria-label="Learning performance over time">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-dashboard-text">Learning performance</h4>
          <p className="mt-1 text-xs text-dashboard-muted">{activeTimeframe === 'week' ? 'This week' : 'Last 30 days'} · score over time</p>
        </div>
        <span className="inline-flex items-center gap-2 text-xs text-dashboard-muted"><span className="h-2 w-2 rounded-full bg-dashboard-primary" />{peakScore === null ? 'Learning score' : `Peak ${peakScore}%`}</span>
      </div>
      <div className="flex gap-3">
        <div className="flex h-60 shrink-0 flex-col justify-between text-right text-[11px] tabular-nums text-dashboard-muted" aria-hidden="true">
          {ANALYTICS_SCORE_TICKS.map((score) => <span key={score}>{score}%</span>)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="relative h-60">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between" aria-hidden="true">
              {ANALYTICS_SCORE_TICKS.map((score) => <div key={score} className="border-t border-dashed border-dashboard-border/80" />)}
            </div>
            <svg className="relative h-full w-full overflow-visible" viewBox="0 0 350 100" preserveAspectRatio="none" role="img" aria-label={points.length ? `Learning scores across ${points.length} recorded periods` : 'No learning scores recorded for this period'}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-dashboard-primary)" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="var(--color-dashboard-primary)" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              {pathD && <>
                <path d={`${pathD} L ${points[points.length - 1].x},100 L ${points[0].x},100 Z`} fill={`url(#${gradientId})`} />
                <path d={pathD} fill="none" stroke="var(--color-dashboard-primary)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                {points.map((point) => <circle key={point.day} cx={point.x} cy={point.y} r="1.2" fill="var(--color-dashboard-panel)" stroke="var(--color-dashboard-primary)" strokeWidth="1.5" vectorEffect="non-scaling-stroke"><title>{point.day}: {point.score}%</title></circle>)}
              </>}
            </svg>
            {points.length === 0 && <div className="absolute inset-0 flex items-center justify-center px-3 text-center">
              <div className="rounded-lg border border-dashboard-border bg-dashboard-panel px-5 py-4">
                <p className="text-sm font-medium text-dashboard-text">No activity recorded yet</p>
                <p className="mt-1 text-xs leading-5 text-dashboard-muted">Learning history isn’t available for this period.</p>
              </div>
            </div>}
          </div>
          <div className="mt-3 flex justify-between gap-1 text-[10px] text-dashboard-muted sm:text-xs" aria-hidden="true">
            {labels.map((label) => <span key={label}>{label}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
});
AnalyticsTrendGraph.displayName = 'AnalyticsTrendGraph';
