'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TimetableService } from '@/services/timetableService';
import { useAuthStore } from '@/features/auth/state/authStore';
import type {
  ScheduleItem,
  ScheduleViewMode,
  UseClassScheduleSectionOptions,
} from '../types/schedule.types';
import { DAYS_OF_WEEK } from '../constants/scheduleConstants';
import { filterScheduleItemsByDay } from '../utilities/scheduleUtils';
import { useScheduleEndSync } from './useScheduleEndSync';
import { useScheduleSelectedDay } from './useScheduleSelectedDay';
import { useTimetablePlannerModal } from './useTimetablePlannerModal';

export function useClassScheduleSection(
  options: UseClassScheduleSectionOptions = {}
) {
  const {
    scheduleItems: initialScheduleItems = [],
    defaultDay,
    defaultViewMode = 'timeline',
  } = options;

  const queryClient = useQueryClient();
  const [saveError, setSaveError] = useState<string | null>(null);
  const profileTimezone = useAuthStore((state) => state.user?.timezone || '');
  const userId = useAuthStore((state) => state.user?.id);
  const saved = useQuery({ queryKey: ['saved-timetable', userId], queryFn: ({ signal }) => TimetableService.saved(signal), enabled: Boolean(userId), refetchInterval: 30000 });
  const [localItems, setScheduleItems] = useState<ScheduleItem[]>(initialScheduleItems);
  const scheduleItems = saved.data ?? localItems;
  useScheduleEndSync(scheduleItems, profileTimezone, userId);
  const { selectedDay, setSelectedDay } = useScheduleSelectedDay(scheduleItems[0]?.timezone || profileTimezone, defaultDay);
  const [viewMode, setViewMode] = useState<ScheduleViewMode>(defaultViewMode);
  const [selectedNoticeItem, setSelectedNoticeItem] = useState<ScheduleItem | null>(null);

  const handleCloseNotice = useCallback(() => {
    setSelectedNoticeItem(null);
  }, []);

  const handleScheduleUpdated = useCallback((newItems: ScheduleItem[]) => {
    setScheduleItems(newItems);
    queryClient.setQueryData(['saved-timetable', userId], newItems);
  }, [queryClient, userId]);

  const selectDay = setSelectedDay;

  const toggleViewMode = useCallback((mode: ScheduleViewMode) => {
    setViewMode(mode);
  }, []);

  const filteredItems = useMemo(() => {
    return filterScheduleItemsByDay(scheduleItems, selectedDay);
  }, [scheduleItems, selectedDay]);

  const {
    error,
    jobStatus,
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

  const handleAddScheduleSlot = useCallback(async (newItem: ScheduleItem) => {
    try {
      setSaveError(null);
      const items = await TimetableService.add(newItem);
      queryClient.setQueryData(['saved-timetable', userId], items);
    } catch {
      const message = 'Unable to save this slot. Select a registered course and a time without conflicts.';
      setSaveError(message);
      throw new Error(message);
    }
  }, [queryClient, userId]);

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
    error: error || saveError || (saved.error ? 'Unable to load your saved timetable.' : null),
    jobStatus,
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

