export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type ScheduleViewMode = 'timeline' | 'grid';

export interface ScheduleItem {
  planStartDate?: string;
  planEndDate?: string;
  weekNumber?: number;
  sessionKind?: 'lesson' | 'practice' | 'quiz';
  subtopics?: string[];
  exercises?: string[];
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

export interface SessionJoinResult { lessonTopic: string; courseTitle: string }
