import type { LessonTopicItem, NavTabItem, StudentRecord, LectureNoteItem } from '../types/sidebar.types';

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
}

export const DEFAULT_LECTURE_TITLE = "Your classroom";
export const DEFAULT_MODULE_NAME = "";

export const DEFAULT_LESSON_TOPICS: LessonTopicItem[] = [];

export const DEFAULT_MODULE_TITLE = "Today's Outline";
export const DEFAULT_ACTIVE_TOPIC_ID = '';

export const DEFAULT_NAV_TABS: NavTabItem[] = [
  { id: 'notes', label: 'Notes', iconName: 'notes' },
  { id: 'assignments', label: 'Assignments', iconName: 'assignments' },
  { id: 'quiz', label: 'Quiz', iconName: 'quiz' },
  { id: 'announcements', label: 'Announcements', iconName: 'announcements' },
];

export const DEFAULT_LECTURE_NOTES: LectureNoteItem[] = [];

export const DEFAULT_ATTENDANCE_SUMMARY: AttendanceSummary = { total: 0, present: 0, absent: 0 };

export const DEFAULT_STUDENTS: StudentRecord[] = [];

export const DEFAULT_CHAT_MESSAGES: import('../types/input.types').ChatMessage[] = [];
