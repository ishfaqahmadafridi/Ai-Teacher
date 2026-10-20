'use client';

import { memo } from 'react';
import { AnalyticsSummaryItem } from './AnalyticsSummaryItem';
import type { AnalyticsStreakFooterProps } from '../../types/analytics.types';

export const AnalyticsStreakFooter = memo(function AnalyticsStreakFooter({ streakDays, className = '' }: AnalyticsStreakFooterProps) {
  return <AnalyticsSummaryItem label="Streak" value={streakDays} unit={streakDays === 1 ? 'day' : 'days'} iconName="flame" description={streakDays > 0 ? 'Keep your momentum going' : 'Build a daily learning habit'} className={className} />;
});
AnalyticsStreakFooter.displayName = 'AnalyticsStreakFooter';
