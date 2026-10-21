'use client';

import { useState, useCallback } from 'react';
import { TIMETABLE_TIME_WINDOWS } from '../constants/timetableConstants';
import { timetableAvailabilityError } from '../utilities/timetablePreferencesUtils';
import { DEFAULT_STUDY_PLAN_DAYS } from '../constants/studyPlanConstants';
import { DEFAULT_STUDENT_PREFERENCES } from '../constants/scheduleConstants';
import { useAuthStore } from '@/features/auth/state/authStore';
import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/services/dashboardService';
import type {
  DayOfWeek,
  PreferredTimeOfDay,
  MaxClassesPerDay,
  StudentSchedulePreferences,
  UseTimetablePreferencesModalOptions,
} from '../types/schedule.types';

export function useTimetablePreferencesModal(
  options: UseTimetablePreferencesModalOptions
) {
  const { onSubmitPreferences, initialPreferences } = options;
  const [studyDays, setStudyDays] = useState<DayOfWeek[]>(initialPreferences?.studyDays ?? DEFAULT_STUDY_PLAN_DAYS);
  const toggleStudyDay = useCallback((day: DayOfWeek) => setStudyDays(previous => previous.includes(day) ? previous.filter(item => item !== day) : [...previous, day]), []);
  const [courseIds, setCourseIds] = useState<string[]>(initialPreferences?.courseIds ?? []);
  const toggleCourse = useCallback((id: string) => setCourseIds(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]), []);
  const userId = useAuthStore((state) => state.user?.id);
  const courses = useQuery({ queryKey: ['timetable-courses', userId], queryFn: () => DashboardService.getCourses(), enabled: Boolean(userId) });
  const registeredCourses = courses.data?.map((course) => course.title);
  const [customStartTime, setCustomStartTime] = useState(initialPreferences?.customStartTime ?? TIMETABLE_TIME_WINDOWS.morning[0]);
  const [customEndTime, setCustomEndTime] = useState(initialPreferences?.customEndTime ?? TIMETABLE_TIME_WINDOWS.morning[1]);
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
      if (!courseIds.length) { setTimeError('Select at least one course with a saved study plan.'); return; }
      if (!studyDays.length) { setTimeError('Choose at least one study day.'); return; }
      const availabilityError = timetableAvailabilityError({ preferredTime, customStartTime, customEndTime, maxClassesPerDay });
      if (availabilityError) { setTimeError(availabilityError); return; }
      const prefs: StudentSchedulePreferences = {
        useSavedPlans: true, courseIds, studyDays,
        preferredTime,
        customStartTime,
        customEndTime,
        maxClassesPerDay,
        includeSaturday,
        registeredCourses:
          initialPreferences?.registeredCourses ??
          registeredCourses ?? [],
      };
      onSubmitPreferences(prefs);
    },
    [
      courseIds, studyDays,
      preferredTime,
      customStartTime,
      customEndTime,
      maxClassesPerDay,
      includeSaturday,
      initialPreferences?.registeredCourses,
      registeredCourses,
      onSubmitPreferences,
    ]
  );

  const resetPreferences = useCallback(() => {
    setCourseIds(initialPreferences?.courseIds ?? []);
    setStudyDays(initialPreferences?.studyDays ?? DEFAULT_STUDY_PLAN_DAYS);
    setCustomStartTime(initialPreferences?.customStartTime ?? TIMETABLE_TIME_WINDOWS.morning[0]);
    setCustomEndTime(initialPreferences?.customEndTime ?? TIMETABLE_TIME_WINDOWS.morning[1]);
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
    courseIds, toggleCourse, courseOptions: courses.data ?? [], coursesLoading: courses.isPending, coursesError: courses.isError, studyDays, toggleStudyDay,
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
