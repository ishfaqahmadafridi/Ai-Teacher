import type { LiveClassItem } from '../types/dashboard.types';
import type { ClassCardMetrics } from '../types/classes.types';

/**
 * Pure helper function to compute lesson completion metrics and percentages for ClassCard UI.
 */
export function calculateClassCardMetrics(classItem: LiveClassItem): ClassCardMetrics {
  const progress = classItem.progressPercent ?? 65;
  const completed = classItem.completedLessons ?? 13;
  const total = classItem.totalLessons ?? 20;
  const remaining = Math.max(0, total - completed);
  const remainingPercent = Math.max(0, 100 - progress);

  return {
    progress,
    completed,
    total,
    remaining,
    remainingPercent,
  };
}
