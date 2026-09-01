'use client';

import { useState, useCallback } from 'react';
import { DEFAULT_STUDENT_PREFERENCES } from '../constants/scheduleConstants';
import { generateSuggestedTimetable } from '../utilities/scheduleUtils';
import type {
  DayOfWeek,
  ScheduleItem,
  StudentSchedulePreferences,
  SuggestedTimetable,
} from '../types/schedule.types';

export interface UseTimetablePlannerModalOptions {
  onScheduleUpdated?: (newItems: ScheduleItem[]) => void;
}

export function useTimetablePlannerModal(options: UseTimetablePlannerModalOptions = {}) {
  const { onScheduleUpdated } = options;

  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<StudentSchedulePreferences>(DEFAULT_STUDENT_PREFERENCES);
  const [suggestedTimetable, setSuggestedTimetable] = useState<SuggestedTimetable | null>(null);

  const openPreferences = useCallback(() => {
    setIsPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
  }, []);

  const closeReview = useCallback(() => {
    setIsReviewOpen(false);
  }, []);

  const submitPreferences = useCallback(
    async (newPreferences: StudentSchedulePreferences) => {
      setPreferences(newPreferences);
      setIsLoading(true);

      try {
        // Deterministic constraint engine + optimization
        const generated = generateSuggestedTimetable(newPreferences);
        setSuggestedTimetable(generated);
        setIsPreferencesOpen(false);
        setIsReviewOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const acceptTimetable = useCallback(
    (schedule: ScheduleItem[]) => {
      if (onScheduleUpdated) {
        onScheduleUpdated(schedule);
      }
      setIsReviewOpen(false);
    },
    [onScheduleUpdated]
  );

  const customizeSlot = useCallback(
    (itemId: string, newDay: DayOfWeek, newSlot: string) => {
      setSuggestedTimetable((prev) => {
        if (!prev) return prev;
        const updated = prev.schedule.map((item) =>
          item.id === itemId
            ? { ...item, dayOfWeek: newDay, timeFormatted: newSlot, timeSlot: newSlot }
            : item
        );
        return { ...prev, schedule: updated };
      });
    },
    []
  );

  return {
    isPreferencesOpen,
    isReviewOpen,
    isLoading,
    preferences,
    suggestedTimetable,
    openPreferences,
    closePreferences,
    closeReview,
    submitPreferences,
    acceptTimetable,
    customizeSlot,
  };
}
