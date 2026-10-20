'use client';

import { memo } from 'react';
import type { AssignmentCardGradeBannerProps } from '../../types/assignments.types';

export const AssignmentCardGradeBanner = memo(function AssignmentCardGradeBanner({
  grade,
}: AssignmentCardGradeBannerProps) {
  if (!grade) return null;

  return (
    <div className="p-3 rounded-2xl bg-dashboard-success/15 border border-dashboard-success/30 text-xs text-dashboard-success font-semibold space-y-1">
      <div className="flex items-center justify-between font-bold">
        <span>Graded Output Score</span>
        <span className="font-mono text-sm">
          {grade.score} / {grade.maxScore} PTS
        </span>
      </div>
      {grade.feedback && (
        <div className="text-[11px] text-dashboard-success italic">
          &ldquo;{grade.feedback}&rdquo;
        </div>
      )}
    </div>
  );
});

AssignmentCardGradeBanner.displayName = 'AssignmentCardGradeBanner';
