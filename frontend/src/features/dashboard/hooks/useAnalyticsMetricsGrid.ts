'use client';

import { useMemo } from 'react';
import type {
  UseAnalyticsMetricsGridOptions,
  AnalyticsMetricCardItem,
} from '../types/analytics.types';

/**
 * Custom hook to generate structured metric card items for AnalyticsMetricsGrid.
 */
export function useAnalyticsMetricsGrid(options: UseAnalyticsMetricsGridOptions) {
  const {
    assignmentsCompleted,
    totalAssignments,
    quizzesPassed,
    totalQuizzes,
    aiFocusScore,
    conceptMasteryScore,
    classBehaviorScore,
    avgScore = 92,
  } = options;

  const metricItems = useMemo<AnalyticsMetricCardItem[]>(() => {
    return [
      {
        id: 'assignments',
        label: 'Assignments',
        value: `${assignmentsCompleted}/${totalAssignments} Done`,
        iconName: 'file-check',
        accentTheme: 'blue',
      },
      {
        id: 'quizzes',
        label: 'Quizzes',
        value: `${quizzesPassed}/${totalQuizzes} Passed`,
        iconName: 'help-circle',
        accentTheme: 'purple',
      },
      {
        id: 'ai-focus',
        label: 'AI Focus State',
        value: `${aiFocusScore}% Deep Flow`,
        iconName: 'zap',
        accentTheme: 'amber',
      },
      {
        id: 'concept-mastery',
        label: 'Concept Mastery',
        value: `${conceptMasteryScore}% Advanced`,
        iconName: 'brain',
        accentTheme: 'cyan',
      },
      {
        id: 'class-behavior',
        label: 'Class Behavior',
        value: `${classBehaviorScore}% Active`,
        iconName: 'sparkles',
        accentTheme: 'purple',
      },
      {
        id: 'avg-score',
        label: 'Avg Score',
        value: `${avgScore}%`,
        iconName: 'award',
        accentTheme: 'emerald',
      },
    ];
  }, [
    assignmentsCompleted,
    totalAssignments,
    quizzesPassed,
    totalQuizzes,
    aiFocusScore,
    conceptMasteryScore,
    classBehaviorScore,
    avgScore,
  ]);

  return {
    metricItems,
  };
}
