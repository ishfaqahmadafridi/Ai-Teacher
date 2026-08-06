import type {
  StudentProfile,
  ContinueLearningCourse,
  LiveClassItem,
  AssignmentItem,
  DashboardNavLink,
} from '../types/dashboard.types';

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: 'John',
  dateFormatted: 'Jan 24, 2024',
  streakDays: 7,
  weeklyProgressPercent: 75,
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const DEFAULT_CONTINUE_LEARNING: ContinueLearningCourse = {
  id: 'python-7',
  title: 'Python Fundamentals',
  chapter: 'Chapter 7: Dictionaries & Sets',
  progressPercent: 68,
};

export const DEFAULT_LIVE_CLASSES: LiveClassItem[] = [
  {
    id: 'class-1',
    title: 'Newton\'s Second Law & Momentum',
    subject: 'Physics 101',
    instructorName: 'Dr. Evelyn Vance',
    instructorAvatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    timeFormatted: '10:00 AM - 11:30 AM',
    isLive: true,
    attendanceCount: 42,
    bgGradient: 'from-blue-600/20 to-purple-600/20',
  },
  {
    id: 'class-2',
    title: 'Multivariable Calculus & Integrals',
    subject: 'Mathematics 201',
    instructorName: 'Prof. Alan Turing',
    instructorAvatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    timeFormatted: '02:00 PM - 03:30 PM',
    isLive: false,
    attendanceCount: 38,
    bgGradient: 'from-emerald-600/20 to-teal-600/20',
  },
];

export const DEFAULT_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'assign-1',
    title: 'Force Vectors & Equilibrium Worksheet',
    subject: 'Physics 101',
    dueDate: 'Tomorrow, 11:59 PM',
    status: 'pending',
    points: 100,
    type: 'assignment',
    isUrgent: true,
  },
  {
    id: 'assign-2',
    title: 'Python Data Structures Quiz',
    subject: 'Computer Science',
    dueDate: 'Jan 28, 2024',
    status: 'in_progress',
    points: 50,
    type: 'quiz',
  },
  {
    id: 'assign-3',
    title: 'Calculus Integration Practice Set',
    subject: 'Mathematics 201',
    dueDate: 'Jan 30, 2024',
    status: 'completed',
    points: 100,
    type: 'practice_set',
  },
];

export const DEFAULT_DASHBOARD_NAV_LINKS: DashboardNavLink[] = [
  { id: 'dashboard', label: 'Dashboard', iconName: 'dashboard', href: '/dashboard' },
  { id: 'classes', label: 'Classes', iconName: 'calendar_today', href: '/classroom', badgeCount: 2 },
  { id: 'courses', label: 'Courses', iconName: 'school', href: '#' },
  { id: 'enrolled_subjects', label: 'Enrolled Subjects', iconName: 'book_check', href: '#', badgeCount: 4 },
  { id: 'attendance', label: 'Attendance', iconName: 'user_check', href: '#' },
  { id: 'assignments', label: 'Assignments', iconName: 'assignment', href: '#', badgeCount: 3 },
  { id: 'quizzes', label: 'Quizzes', iconName: 'quiz', href: '#' },
  { id: 'calendar', label: 'Calendar', iconName: 'event', href: '#' },
  { id: 'grades', label: 'Grades', iconName: 'grade', href: '#' },
  { id: 'resources', label: 'Resources', iconName: 'folder_open', href: '#' },
];
