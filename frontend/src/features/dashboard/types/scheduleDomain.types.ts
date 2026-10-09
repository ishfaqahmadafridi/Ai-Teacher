export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type ScheduleViewMode = 'timeline' | 'grid';

export interface ScheduleItem {
  attendance?: 'attended' | 'missed' | 'unmarked';
  sessionDate?: string;
  sessionEnded?: boolean;
  timezone?: string;
  id: string;
  title: string;
  subject: string;
  timeFormatted: string;
  startTime?: string;
  endTime?: string;
  timeSlot?: string;
  dayOfWeek: DayOfWeek;
  instructorName: string;
  instructorAvatar?: string;
  roomOrLink: string;
  status: 'upcoming' | 'live' | 'completed';
}
