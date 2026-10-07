'use client';

import { useState, useCallback } from 'react';
import { DEFAULT_STUDENT_PREFERENCES } from '../constants/scheduleConstants';
import { useAuthStore } from '@/features/auth/state/authStore';
import type {
  PreferredTimeOfDay,
  MaxClassesPerDay,
  StudentSchedulePreferences,
  UseTimetablePreferencesModalOptions,
} from '../types/schedule.types';

export function useTimetablePreferencesModal(
  options: UseTimetablePreferencesModalOptions
) {
  const { onSubmitPreferences, initialPreferences } = options;
  const selectedInterests = useAuthStore((state) => state.user?.selectedInterests);
  const [customStartTime, setCustomStartTime] = useState(initialPreferences?.customStartTime ?? '09:00');
  const [customEndTime, setCustomEndTime] = useState(initialPreferences?.customEndTime ?? '12:30');
  const [timeError, setTimeError] = useState<string | null>(null);

  const [preferredTime, setPreferredTime] = useState<PreferredTimeOfDay>(
    initialPreferences?.preferredTime ?? DEFAULT_STUDENT_PREFERENCES.preferredTime
  );
  const [maxClassesPerDay, setMaxClassesPerDay] = useState<MaxClassesPerDay>(
    initialPreferences?.maxClassesPerDay ?? DEFAULT_STUDENT_PREFERENCES.maxClassesPerDay
  );
  const [includeSaturday, setIncludeSaturday] = useState<boolean>(
    initialPreferences?.includeSaturday ?? DEFAULT_STUDENT_PREFERENCES.includeSaturday
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setTimeError(null);
      if (preferredTime === 'custom') {
        const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
        if (!customStartTime || !customEndTime || minutes(customEndTime) - minutes(customStartTime) < 90) {
          setTimeError('Choose an end time at least 90 minutes after the start time on the same day.');
          return;
        }
      }
      const prefs: StudentSchedulePreferences = {
        preferredTime,
        customStartTime,
        customEndTime,
        maxClassesPerDay,
        includeSaturday,
        registeredCourses:
          initialPreferences?.registeredCourses ??
          selectedInterests ?? [],
      };
      onSubmitPreferences(prefs);
    },
    [
      preferredTime,
      customStartTime,
      customEndTime,
      maxClassesPerDay,
      includeSaturday,
      initialPreferences?.registeredCourses,
      selectedInterests,
      onSubmitPreferences,
    ]
  );

  const resetPreferences = useCallback(() => {
    setCustomStartTime(initialPreferences?.customStartTime ?? '09:00');
    setCustomEndTime(initialPreferences?.customEndTime ?? '12:30');
    setTimeError(null);
    setPreferredTime(
      initialPreferences?.preferredTime ?? DEFAULT_STUDENT_PREFERENCES.preferredTime
    );
    setMaxClassesPerDay(
      initialPreferences?.maxClassesPerDay ?? DEFAULT_STUDENT_PREFERENCES.maxClassesPerDay
    );
    setIncludeSaturday(
      initialPreferences?.includeSaturday ?? DEFAULT_STUDENT_PREFERENCES.includeSaturday
    );
  }, [initialPreferences]);

  return {
    customStartTime, setCustomStartTime, customEndTime, setCustomEndTime, timeError,
    preferredTime,
    setPreferredTime,
    maxClassesPerDay,
    setMaxClassesPerDay,
    includeSaturday,
    setIncludeSaturday,
    handleSubmit,
    resetPreferences,
  };
}
