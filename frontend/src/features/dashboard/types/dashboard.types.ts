export interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  gradeLevel: string;
  dateFormatted: string;
  streakDays: number;
  weeklyProgressPercent: number;
  avatarUrl: string;
  coverUrl?: string;
  joinedDate?: string;
  bio?: string;
  preferredLanguage?: string;
}

export interface ContinueLearningCourse {
  id: string;
  title: string;
  chapter: string;
  progressPercent: number;
}

export interface LiveClassItem {
  id: string;
  title: string;
  subject: string;
  instructorName: string;
  instructorAvatar: string;
  timeFormatted: string;
  isLive: boolean;
  attendanceCount: number;
  bgGradient: string;
  progressPercent?: number;
  completedLessons?: number;
  totalLessons?: number;
  timeRemaining?: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'in_progress';
  points: number;
  type?: 'assignment' | 'quiz' | 'practice_set';
  isUrgent?: boolean;
}

export interface DashboardNavLink {
  id: string;
  label: string;
  iconName: string;
  href: string;
  badgeCount?: number;
}

export interface DashboardBackgroundGlowProps {
  className?: string;
}

export interface UseDashboardOverviewGridOptions {
  continueLearningId?: string;
  onResumeCourse?: (id?: string) => void;
  onJoinClass?: (id?: string) => void;
}

export interface DashboardOverviewGridProps {
  studentName: string;
  streakDays: number;
  weeklyProgressPercent: number;
  continueLearning: ContinueLearningCourse;
  liveClasses: LiveClassItem[];
  assignments: AssignmentItem[];
  onJoinClass?: (id?: string) => void;
  onResumeCourse?: (id?: string) => void;
  className?: string;
}

export interface DashboardLayoutProps {
  className?: string;
}

export interface DashboardMainContentProps {
  activeTabId: string;
  studentName: string;
  streakDays: number;
  weeklyProgressPercent: number;
  registeredCourses: import('./courses.types').RegisteredCourseItem[];
  continueLearning: ContinueLearningCourse;
  liveClasses: LiveClassItem[];
  assignments: AssignmentItem[];
  autoOpenTask?: import('./assignments.types').AutoOpenTaskPayload | null;
  onJoinClass?: (id?: string) => void;
  onResumeCourse?: (id?: string) => void;
  onOpenRegisterCourseModal?: () => void;
  className?: string;
}

// Canonical Re-exports for Feature Types
export * from './sidebar.types';
export * from './topbar.types';
export * from './profile.types';
export * from './hero.types';
export * from './classes.types';
export * from './analytics.types';
export * from './courses.types';
export * from './schedule.types';
export * from './progress.types';
export * from './assignments.types';
