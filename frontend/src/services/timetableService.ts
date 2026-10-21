import { isAxiosError } from 'axios';
import { apiClient } from '@/lib/api';
import type { ScheduleItem, StudentSchedulePreferences, SessionJoinResult } from '@/features/dashboard/types/schedule.types';
import { buildTimetableRequest } from '@/features/dashboard/utilities/timetablePreferencesUtils';
import type { TimetableJob } from '@/features/dashboard/types/timetableJob.types';
export type { TimetableJob } from '@/features/dashboard/types/timetableJob.types';
const base = '/api/dashboard/timetable/';
export const TimetableService = {
  async join(id: string): Promise<SessionJoinResult> { return (await apiClient.post<SessionJoinResult>(`${base}sessions/${id}/join/`)).data; },
  async generate(preferences: StudentSchedulePreferences, timezone: string): Promise<TimetableJob> {
    try {
      return (await apiClient.post<TimetableJob>(`${base}generate/`, buildTimetableRequest(preferences, timezone))).data;
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        const message = data?.detail || data?.non_field_errors?.[0];
        if (typeof message === 'string') throw new Error(message);
      }
      throw error;
    }
  },
  async job(id: string, signal?: AbortSignal): Promise<TimetableJob> { return (await apiClient.get<TimetableJob>(`${base}jobs/${id}/`, { signal })).data; },
  async accept(id: string): Promise<ScheduleItem[]> { return (await apiClient.post<{schedule: ScheduleItem[]}>(`${base}jobs/${id}/`)).data.schedule; },
  async add(item: ScheduleItem): Promise<ScheduleItem[]> { return (await apiClient.post<{schedule: ScheduleItem[]}>(base, item)).data.schedule; },
  async saved(signal?: AbortSignal): Promise<ScheduleItem[]> { return (await apiClient.get<{schedule: ScheduleItem[]}>(base, { signal })).data.schedule; },
};
