import { isAxiosError } from 'axios';
import { apiClient } from '@/lib/api';
import type { ScheduleItem, SuggestedTimetable, StudentSchedulePreferences } from '@/features/dashboard/types/schedule.types';
export interface TimetableJob { id: string; status: 'queued' | 'processing' | 'ready' | 'failed'; result?: SuggestedTimetable; error?: string }
const base = '/api/dashboard/timetable/';
export const TimetableService = {
  async generate(preferences: StudentSchedulePreferences, timezone: string): Promise<TimetableJob> {
    const windows = { morning: ['09:00', '12:30'], afternoon: ['14:00', '17:00'], evening: ['16:00', '19:30'], any: ['09:00', '19:30'] };
    const window = preferences.preferredTime === 'custom' ? [preferences.customStartTime, preferences.customEndTime] : windows[preferences.preferredTime];
    try {
    return (await apiClient.post<TimetableJob>(`${base}generate/`, { start_time: window[0], end_time: window[1], days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', ...(preferences.includeSaturday ? ['Saturday'] : [])], max_classes: preferences.maxClassesPerDay, timezone })).data;
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
