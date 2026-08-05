import type { LessonTopicItem, NavTabItem, StudentRecord } from '../types/sidebar.types';

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
}

export const DEFAULT_LESSON_TOPICS: LessonTopicItem[] = [
  { id: 'intro', title: 'Introduction' },
  { id: 'definition', title: 'Definition & Scope' },
  { id: 'core-formulae', title: 'Core Formulae', isLive: true },
  { id: 'practical-examples', title: 'Practical Examples', isDisabled: true },
];

export const DEFAULT_MODULE_TITLE = "Today's Lesson";
export const DEFAULT_ACTIVE_TOPIC_ID = 'core-formulae';

export const DEFAULT_NAV_TABS: NavTabItem[] = [
  { id: 'notes', label: 'Notes', iconName: 'notes' },
  { id: 'assignments', label: 'Assignments', iconName: 'assignments' },
  { id: 'quiz', label: 'Quiz', iconName: 'quiz' },
  { id: 'announcements', label: 'Announcements', iconName: 'announcements' },
];

export const DEFAULT_ATTENDANCE_SUMMARY: AttendanceSummary = {
  total: 32,
  present: 28,
  absent: 4,
};

export const MOCK_STUDENTS: StudentRecord[] = [
  { id: '1', name: 'Alex Johnson', rollNumber: 'ST-101', status: 'present', avatarBg: 'bg-blue-600' },
  { id: '2', name: 'Sophia Chen', rollNumber: 'ST-102', status: 'present', avatarBg: 'bg-emerald-600' },
  { id: '3', name: 'Marcus Brody', rollNumber: 'ST-103', status: 'present', avatarBg: 'bg-[#7c4dff]' },
  { id: '4', name: 'Emily Davis', rollNumber: 'ST-104', status: 'absent', avatarBg: 'bg-rose-600' },
  { id: '5', name: 'Liam Wilson', rollNumber: 'ST-105', status: 'present', avatarBg: 'bg-amber-600' },
  { id: '6', name: 'Olivia Martinez', rollNumber: 'ST-106', status: 'present', avatarBg: 'bg-indigo-600' },
  { id: '7', name: 'Ethan Hunt', rollNumber: 'ST-107', status: 'absent', avatarBg: 'bg-red-600' },
  { id: '8', name: 'Ava Taylor', rollNumber: 'ST-108', status: 'present', avatarBg: 'bg-teal-600' },
  { id: '9', name: 'Noah Anderson', rollNumber: 'ST-109', status: 'present', avatarBg: 'bg-cyan-600' },
  { id: '10', name: 'Isabella Thomas', rollNumber: 'ST-110', status: 'absent', avatarBg: 'bg-pink-600' },
  { id: '11', name: 'Lucas Jackson', rollNumber: 'ST-111', status: 'present', avatarBg: 'bg-purple-600' },
  { id: '12', name: 'Mia White', rollNumber: 'ST-112', status: 'present', avatarBg: 'bg-sky-600' },
  { id: '13', name: 'Benjamin Harris', rollNumber: 'ST-113', status: 'absent', avatarBg: 'bg-red-700' },
  { id: '14', name: 'Charlotte Martin', rollNumber: 'ST-114', status: 'present', avatarBg: 'bg-emerald-700' },
  { id: '15', name: 'Henry Thompson', rollNumber: 'ST-115', status: 'present', avatarBg: 'bg-blue-700' },
];
