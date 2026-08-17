'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  DEFAULT_PERFORMANCE_TREND_DATA,
  DEFAULT_MONTHLY_TREND_DATA,
} from '../constants/analyticsConstants';
import type { UseProgressAnalyticsCardOptions } from '../types/analytics.types';

/**
 * Custom hook for ProgressAnalyticsCard.
 * Manages timeframe selection state, clamped progress calculations, and trend data.
 */
export function useProgressAnalyticsCard(options: UseProgressAnalyticsCardOptions = {}) {
  const { weeklyProgressPercent = 75 } = options;
  const [activeTimeframe, setActiveTimeframe] = useState<'week' | 'month'>('week');

  const handleSelectTimeframe = useCallback((tf: 'week' | 'month') => {
    setActiveTimeframe(tf);
  }, []);

  const clampedProgress = useMemo(() => {
    return Math.min(100, Math.max(0, weeklyProgressPercent));
  }, [weeklyProgressPercent]);

  const trendData = useMemo(() => {
    return activeTimeframe === 'week' ? DEFAULT_PERFORMANCE_TREND_DATA : DEFAULT_MONTHLY_TREND_DATA;
  }, [activeTimeframe]);

  return {
    activeTimeframe,
    handleSelectTimeframe,
    clampedProgress,
    trendData,
  };
}
