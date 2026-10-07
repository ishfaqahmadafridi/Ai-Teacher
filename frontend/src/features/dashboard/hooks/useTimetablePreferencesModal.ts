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
      const prefs: StudentSchedulePreferences = {
        preferredTime,
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
      maxClassesPerDay,
      includeSaturday,
      initialPreferences?.registeredCourses,
      selectedInterests,
      onSubmitPreferences,
    ]
  );

  const resetPreferences = useCallback(() => {
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
