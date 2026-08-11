'use client';

import { useState, useMemo, useCallback } from 'react';
import type {
  DayOfWeek,
  ScheduleViewMode,
  UseClassScheduleSectionOptions,
} from '../types/schedule.types';
import { DAYS_OF_WEEK } from '../constants/scheduleConstants';
import { DEFAULT_SCHEDULE_ITEMS } from '../constants/dashboardContentConstants';
import { filterScheduleItemsByDay } from '../utilities/scheduleUtils';

export function useClassScheduleSection(
  options: UseClassScheduleSectionOptions = {}
) {
  const {
    scheduleItems = DEFAULT_SCHEDULE_ITEMS,
    defaultDay = 'Monday',
    defaultViewMode = 'timeline',
  } = options;

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(defaultDay);
  const [viewMode, setViewMode] = useState<ScheduleViewMode>(defaultViewMode);

  const filteredItems = useMemo(() => {
    return filterScheduleItemsByDay(scheduleItems, selectedDay);
  }, [scheduleItems, selectedDay]);

  const selectDay = useCallback((day: DayOfWeek) => {
    setSelectedDay(day);
  }, []);

  const toggleViewMode = useCallback((mode: ScheduleViewMode) => {
    setViewMode(mode);
  }, []);

  return {
    days: DAYS_OF_WEEK,
    selectedDay,
    setSelectedDay: selectDay,
    viewMode,
    setViewMode: toggleViewMode,
    filteredItems,
    scheduleItems,
  };
}
