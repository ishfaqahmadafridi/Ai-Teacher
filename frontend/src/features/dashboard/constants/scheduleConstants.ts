import type { DayOfWeek } from '../types/schedule.types';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const WEEKDAYS_MATRIX: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const SHORT_DAYS: Record<DayOfWeek, string> = {
  Monday: 'MON',
  Tuesday: 'TUE',
  Wednesday: 'WED',
  Thursday: 'THU',
  Friday: 'FRI',
  Saturday: 'SAT',
  Sunday: 'SUN',
};

export const SCHEDULE_TIME_SLOTS: string[] = [
  '09:00 AM - 10:30 AM',
  '10:00 AM - 11:30 AM',
  '11:00 AM - 12:30 PM',
  '02:00 PM - 03:30 PM',
  '04:00 PM - 05:30 PM',
];

export const DEFAULT_STUDENT_PREFERENCES = {
  preferredTime: 'morning' as const,
  maxClassesPerDay: 2 as const,
  includeSaturday: true,
  registeredCourses: [
    'Physics Mechanics 101',
    'Calculus II & Linear Algebra',
    'Intro to Computer Science',
  ],
};

export const TIME_PREFERENCE_OPTIONS = [
  { id: 'morning', label: 'Morning Focus (09:00 AM - 12:30 PM)', desc: 'Best for high cognitive energy' },
  { id: 'afternoon', label: 'Afternoon Focus (02:00 PM - 05:00 PM)', desc: 'Ideal for balanced post-lunch study' },
  { id: 'evening', label: 'Evening Classes (04:00 PM - 07:30 PM)', desc: 'Perfect for working students' },
  { id: 'any', label: 'No Preference (AI Fully Balanced)', desc: 'Evenly distributes across all day slots' },
] as const;

export const MAX_CLASSES_OPTIONS = [
  { id: 2, label: 'Max 2 Classes / Day', desc: 'Recommended: Prevents cognitive fatigue' },
  { id: 3, label: 'Max 3 Classes / Day', desc: 'Intensive: Faster course completion' },
  { id: 4, label: 'Up to 4 Classes / Day', desc: 'Accelerated study roadmap' },
] as const;

export const STUDY_DAYS_OPTIONS = [
  { id: 'mon_fri', label: 'Monday to Friday (Weekdays Only)', includeSaturday: false },
  { id: 'include_sat', label: 'Include Saturday (For Workshops & Labs)', includeSaturday: true },
] as const;

export const AVAILABLE_SUBJECT_OPTIONS = [
  'Physics Mechanics 101',
  'Calculus II & Linear Algebra',
  'Intro to Computer Science',
  'Organic Chemistry Fundamentals',
  'Artificial Intelligence (AI)',
  'Modern World History',
] as const;

export const DEFAULT_CREATE_SCHEDULE_SLOT_FORM = {
  title: 'Mechanics & Wave Dynamics',
  subject: 'Physics Mechanics 101',
  dayOfWeek: 'Monday' as DayOfWeek,
  timeSlot: '09:00 AM - 10:30 AM',
  instructorName: 'Dr. Sarah Jenkins',
  roomOrLink: 'Room 402B • Science Hall',
  status: 'upcoming' as const,
};


