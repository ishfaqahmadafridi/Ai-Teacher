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
    avgScore = 0,
  } = options;

  const metricItems = useMemo<AnalyticsMetricCardItem[]>(() => {
    return [
      {
        id: 'assignments',
        label: 'Assignments',
        value: totalAssignments > 0 ? `${assignmentsCompleted}/${totalAssignments} completed` : 'No assignments',
        iconName: 'file-check',
        accentTheme: 'blue',
      },
      {
        id: 'quizzes',
        label: 'Quizzes',
        value: totalQuizzes > 0 ? `${quizzesPassed}/${totalQuizzes} passed` : 'No quizzes',
        iconName: 'help-circle',
        accentTheme: 'purple',
      },
      {
        id: 'ai-focus',
        label: 'Focus score',
        value: `${aiFocusScore}%`,
        iconName: 'zap',
        accentTheme: 'amber',
      },
      {
        id: 'concept-mastery',
        label: 'Concept Mastery',
        value: `${conceptMasteryScore}%`,
        iconName: 'brain',
        accentTheme: 'cyan',
      },
      {
        id: 'class-behavior',
        label: 'Class Behavior',
        value: `${classBehaviorScore}%`,
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
    metricItems: metricItems.filter((item) => {
      switch (item.id) {
        case 'assignments': return totalAssignments > 0;
        case 'quizzes': return totalQuizzes > 0;
        case 'ai-focus': return aiFocusScore > 0;
        case 'concept-mastery': return conceptMasteryScore > 0;
        case 'class-behavior': return classBehaviorScore > 0;
        case 'avg-score': return avgScore > 0;
        default: return false;
      }
    }),
  };
}
