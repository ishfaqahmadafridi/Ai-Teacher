'use client';

import { memo } from 'react';
import { GraduationCap } from 'lucide-react';
import type { ContinueLearningBannerProps } from '../../types/dashboard.types';

export const ContinueLearningBanner = memo(function ContinueLearningBanner({ fieldName, className = '' }: ContinueLearningBannerProps) {
  return (
    <div className={`flex min-w-0 items-center gap-2 text-sm ${className}`}>
      <GraduationCap className="h-4 w-4 shrink-0 text-dashboard-muted" aria-hidden="true" />
      <span className="text-dashboard-muted">Studying</span>
      <span className="truncate font-medium text-dashboard-text">{fieldName}</span>
    </div>
  );
});
ContinueLearningBanner.displayName = 'ContinueLearningBanner';
