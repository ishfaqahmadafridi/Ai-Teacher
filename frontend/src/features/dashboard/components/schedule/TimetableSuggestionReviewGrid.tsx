'use client';

import { memo } from 'react';
import { StudyPlanWeeks } from './StudyPlanWeeks';
import { TimetableSuggestionCard } from './TimetableSuggestionCard';
import type { TimetableSuggestionReviewGridProps } from '../../types/schedule.types';

export const TimetableSuggestionReviewGrid = memo(
  function TimetableSuggestionReviewGrid({
    schedule,
    totalWeeklyClasses,
    className = '',
  }: TimetableSuggestionReviewGridProps) {
    if (schedule.some(item => item.planStartDate)) return <StudyPlanWeeks items={schedule} />;
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between text-xs font-semibold text-dashboard-muted uppercase tracking-wider">
          <span>Generated Weekly Distribution</span>
          <span className="text-purple-400">
            {totalWeeklyClasses} Sessions Planned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {schedule.map((item) => (
            <TimetableSuggestionCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  }
);

TimetableSuggestionReviewGrid.displayName = 'TimetableSuggestionReviewGrid';
