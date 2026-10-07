'use client';

import { useState, useCallback, useMemo } from 'react';
import type { UseProgressAnalyticsCardOptions } from '../types/analytics.types';

/**
 * Custom hook for ProgressAnalyticsCard.
 * Manages timeframe selection state, clamped progress calculations, and trend data.
 */
export function useProgressAnalyticsCard(options: UseProgressAnalyticsCardOptions = {}) {
  const { weeklyProgressPercent = 0 } = options;
  const [activeTimeframe, setActiveTimeframe] = useState<'week' | 'month'>('week');

  const handleSelectTimeframe = useCallback((tf: 'week' | 'month') => {
    setActiveTimeframe(tf);
  }, []);

  const clampedProgress = useMemo(() => {
    return Math.min(100, Math.max(0, weeklyProgressPercent));
  }, [weeklyProgressPercent]);

  const trendData = useMemo(() => {
    return [];
  }, []);

  return {
    activeTimeframe,
    handleSelectTimeframe,
    clampedProgress,
    trendData,
  };
}
