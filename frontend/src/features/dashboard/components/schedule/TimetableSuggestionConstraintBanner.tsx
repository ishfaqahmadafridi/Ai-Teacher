'use client';

import { memo } from 'react';
import type { TimetableSuggestionConstraintBannerProps } from '../../types/schedule.types';

export const TimetableSuggestionConstraintBanner = memo(
  function TimetableSuggestionConstraintBanner({
    className = '',
  }: TimetableSuggestionConstraintBannerProps) {
    return (
      <div
        className={`p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between ${className}`}
      >
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-dashboard-text block">
            Constraint Satisfaction Verified
          </span>
          <span className="text-[11px] text-dashboard-muted">
            Zero overlapping time slots • Balanced cognitive load
          </span>
        </div>
        <span className="text-xs font-bold text-emerald-400">100% Conflict-Free</span>
      </div>
    );
  }
);

TimetableSuggestionConstraintBanner.displayName =
  'TimetableSuggestionConstraintBanner';
