import type { ScheduleItem, SuggestedTimetable } from './schedule.types';
export interface TimetableJob { id: string; status: 'queued' | 'processing' | 'ready' | 'failed'; result?: SuggestedTimetable; error?: string }
export interface UseTimetablePlannerModalOptions { onScheduleUpdated?: (items: ScheduleItem[]) => void }
