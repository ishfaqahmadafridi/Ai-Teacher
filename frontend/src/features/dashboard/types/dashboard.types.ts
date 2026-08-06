export interface StudentProfile {
  name: string;
  dateFormatted: string;
  streakDays: number;
  weeklyProgressPercent: number;
  avatarUrl: string;
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

export interface DashboardTopNavProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  unreadNotificationsCount?: number;
  studentAvatar: string;
  className?: string;
}

export interface DashboardSideNavProps {
  activeTabId?: string;
  onSelectTab?: (id: string) => void;
  studentName: string;
  dateFormatted: string;
  studentAvatar: string;
  onJoinTodayClass?: () => void;
  className?: string;
}

export interface DashboardHeroSectionProps {
  studentName: string;
  streakDays: number;
  weeklyProgressPercent: number;
  onJoinTodayClass?: () => void;
  onViewSchedule?: () => void;
  className?: string;
}

export interface ContinueLearningBannerProps {
  course: ContinueLearningCourse;
  onResume?: () => void;
  className?: string;
}

export interface LiveClassesSectionProps {
  classes?: LiveClassItem[];
  onJoinClass?: (id: string) => void;
  className?: string;
}

export interface ClassCardProps {
  classItem: LiveClassItem;
  onJoinClass?: (id: string) => void;
  className?: string;
}

export interface AssignmentsSectionProps {
  assignments?: AssignmentItem[];
  onSelectAssignment?: (id: string) => void;
  onAskAiHelp?: (title: string) => void;
  className?: string;
}

export interface ProgressAnalyticsCardProps {
  weeklyProgressPercent?: number;
  streakDays?: number;
  attendancePercent?: number;
  classesAttended?: number;
  totalClasses?: number;
  classBehaviorScore?: number;
  assignmentsCompleted?: number;
  totalAssignments?: number;
  quizzesPassed?: number;
  totalQuizzes?: number;
  className?: string;
}

export interface DashboardLayoutProps {
  className?: string;
}
