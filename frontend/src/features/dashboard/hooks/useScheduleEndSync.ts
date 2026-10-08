'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getScheduleAccess } from '../utilities/scheduleAccess';
import { useScheduleClock } from './useScheduleClock';
import type { ScheduleItem } from '../types/scheduleDomain.types';

export function useScheduleEndSync(items: ScheduleItem[], timezone: string, userId?: string) {
  const now = useScheduleClock();
  const client = useQueryClient();
  const refreshed = useRef(new Set<string>());
  useEffect(() => {
    if (!now || !userId) return;
    let shouldRefresh = false;
    for (const item of items) {
      const access = getScheduleAccess(item, timezone, new Date(now));
      const key = `${userId}:${access.occurrenceKey}`;
      if (access.ended && !item.sessionEnded && !refreshed.current.has(key)) {
        refreshed.current.add(key);
        shouldRefresh = true;
      }
    }
    if (shouldRefresh) void client.invalidateQueries({ queryKey: ['saved-timetable', userId] });
  }, [items, timezone, userId, now, client]);
}
