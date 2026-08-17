'use client';

import { memo } from 'react';
import { useAnalyticsMetricsGrid } from '../../hooks';
import { AnalyticsMetricCard } from './AnalyticsMetricCard';
import type { AnalyticsMetricsGridProps } from '../../types/analytics.types';

export const AnalyticsMetricsGrid = memo(function AnalyticsMetricsGrid({
  assignmentsCompleted,
  totalAssignments,
  quizzesPassed,
  totalQuizzes,
  aiFocusScore,
  conceptMasteryScore,
  classBehaviorScore,
  avgScore = 92,
  className = '',
}: AnalyticsMetricsGridProps) {
  const { metricItems } = useAnalyticsMetricsGrid({
    assignmentsCompleted,
    totalAssignments,
    quizzesPassed,
    totalQuizzes,
    aiFocusScore,
    conceptMasteryScore,
    classBehaviorScore,
    avgScore,
  });

  return (
    <div className={`relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {metricItems.map((item) => (
        <AnalyticsMetricCard key={item.id} item={item} />
      ))}
    </div>
  );
});

AnalyticsMetricsGrid.displayName = 'AnalyticsMetricsGrid';
