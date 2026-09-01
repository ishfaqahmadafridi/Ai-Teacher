'use client';

import { useState, useMemo, useCallback } from 'react';
import type {
  DayOfWeek,
  ScheduleItem,
  ScheduleViewMode,
  UseClassScheduleSectionOptions,
} from '../types/schedule.types';
import { DAYS_OF_WEEK } from '../constants/scheduleConstants';
import { DEFAULT_SCHEDULE_ITEMS } from '../constants/dashboardContentConstants';
import { filterScheduleItemsByDay } from '../utilities/scheduleUtils';
import { useTimetablePlannerModal } from './useTimetablePlannerModal';

export function useClassScheduleSection(
  options: UseClassScheduleSectionOptions = {}
) {
  const {
    scheduleItems: initialScheduleItems = DEFAULT_SCHEDULE_ITEMS,
    defaultDay = 'Monday',
    defaultViewMode = 'timeline',
  } = options;

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(initialScheduleItems);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(defaultDay);
  const [viewMode, setViewMode] = useState<ScheduleViewMode>(defaultViewMode);
  const [selectedNoticeItem, setSelectedNoticeItem] = useState<ScheduleItem | null>(null);

  const handleCloseNotice = useCallback(() => {
    setSelectedNoticeItem(null);
  }, []);

  const handleScheduleUpdated = useCallback((newItems: ScheduleItem[]) => {
    setScheduleItems(newItems);
  }, []);

  const selectDay = useCallback((day: DayOfWeek) => {
    setSelectedDay(day);
  }, []);

  const toggleViewMode = useCallback((mode: ScheduleViewMode) => {
    setViewMode(mode);
  }, []);

  const filteredItems = useMemo(() => {
    return filterScheduleItemsByDay(scheduleItems, selectedDay);
  }, [scheduleItems, selectedDay]);

  const {
    isPreferencesOpen,
    isReviewOpen,
    isLoading,
    suggestedTimetable,
    openPreferences,
    closePreferences,
    closeReview,
    submitPreferences,
    acceptTimetable,
    customizeSlot,
  } = useTimetablePlannerModal({
    onScheduleUpdated: handleScheduleUpdated,
  });

  const [isManualCreateOpen, setIsManualCreateOpen] = useState(false);

  const openManualCreate = useCallback(() => {
    setIsManualCreateOpen(true);
  }, []);

  const closeManualCreate = useCallback(() => {
    setIsManualCreateOpen(false);
  }, []);

  const handleAddScheduleSlot = useCallback((newItem: ScheduleItem) => {
    setScheduleItems((prev) => [newItem, ...prev]);
  }, []);

  return {
    days: DAYS_OF_WEEK,
    selectedDay,
    setSelectedDay: selectDay,
    viewMode,
    setViewMode: toggleViewMode,
    filteredItems,
    scheduleItems,
    selectedNoticeItem,
    setSelectedNoticeItem,
    handleCloseNotice,
    handleScheduleUpdated,
    // Manual Slot Creation Modal State & Actions
    isManualCreateOpen,
    openManualCreate,
    closeManualCreate,
    handleAddScheduleSlot,
    // AI Timetable Planner Modal State & Actions
    isPreferencesOpen,
    isReviewOpen,
    isLoading,
    suggestedTimetable,
    openPreferences,
    closePreferences,
    closeReview,
    submitPreferences,
    acceptTimetable,
    customizeSlot,
  };
}


