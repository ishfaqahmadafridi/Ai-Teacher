'use client';

import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TimetableService } from '@/services/timetableService';
import { useAuthStore } from '@/features/auth/state/authStore';
import { DEFAULT_STUDENT_PREFERENCES } from '../constants/scheduleConstants';
import type {
  ScheduleItem,
  StudentSchedulePreferences,
} from '../types/schedule.types';

export interface UseTimetablePlannerModalOptions {
  onScheduleUpdated?: (newItems: ScheduleItem[]) => void;
}

export function useTimetablePlannerModal(options: UseTimetablePlannerModalOptions = {}) {
  const { onScheduleUpdated } = options;
  const timezone = useAuthStore((state) => state.user?.timezone);
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const job = useQuery({ queryKey: ['timetable-job', userId, jobId], queryFn: ({ signal }) => TimetableService.job(jobId!, signal), enabled: Boolean(jobId), refetchInterval: (query) => ['ready', 'failed'].includes(query.state.data?.status ?? '') ? false : 2000, retry: false });

  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<StudentSchedulePreferences>(DEFAULT_STUDENT_PREFERENCES);
  const suggestedTimetable = job.data?.status === 'ready' ? job.data.result ?? null : null;
  const isProcessing = isLoading && !suggestedTimetable && job.data?.status !== 'failed' && !job.error;

  const openPreferences = useCallback(() => {
    setJobId(null);
    setIsLoading(false);
    setIsPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
  }, []);

  const closeReview = useCallback(() => {
    setIsLoading(false);
    setIsReviewOpen(false);
  }, []);

  const submitPreferences = useCallback(
    async (newPreferences: StudentSchedulePreferences) => {
      setPreferences(newPreferences);
      setIsLoading(true);

      try {
        setError(null);
        const created = await TimetableService.generate(newPreferences, timezone || 'UTC');
        setJobId(created.id);
        setIsReviewOpen(true);
        await queryClient.invalidateQueries({ queryKey: ['timetable-job', userId, created.id] });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unable to queue a timetable. Check registered courses and try again.');
        setIsLoading(false);
      }
    },
    [timezone, userId, queryClient]
  );

  const acceptTimetable = useCallback(
    async () => {
      if (!jobId) return;
      try {
        const schedule = await TimetableService.accept(jobId);
        onScheduleUpdated?.(schedule);
        await queryClient.invalidateQueries({ queryKey: ['saved-timetable', userId] });
        setIsReviewOpen(false);
        setIsLoading(false);
      } catch { setError('Unable to save the timetable. Please retry.'); }
    },
    [onScheduleUpdated, jobId, queryClient, userId]
  );

  const customizeSlot = useCallback(() => {
    setIsReviewOpen(false);
    setJobId(null);
    setIsLoading(false);
    setIsPreferencesOpen(true);
  }, []);

  return {
    error: error || job.data?.error || (job.error ? 'Unable to check timetable progress.' : null),
    jobStatus: job.data?.status,
    isPreferencesOpen: isPreferencesOpen && !suggestedTimetable,
    isReviewOpen: isReviewOpen || (Boolean(suggestedTimetable) && isLoading),
    isLoading: isProcessing,
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
