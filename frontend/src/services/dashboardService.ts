import { apiClient } from '@/lib/api';
import type {
  RegisteredCourseItem,
  LiveClassItem,
  AssignmentItem,
  ContinueLearningCourse,
} from '@/features/dashboard/types';

export interface DashboardOverviewResponse {
  student_name: string;
  streak_days: number;
  courses_count: number;
  weekly_progress_percent: number;
  attendance_rate_percent: number;
  attendance_ratio: string;
  active_field: string;
  continue_learning: ContinueLearningCourse;
  courses: Array<{
    id: number | string;
    title: string;
    subject_field: string;
    course_code: string;
    credit_hours: number;
    progress_percent: number;
  }>;
  live_classes: Array<{
    id: number | string;
    title: string;
    subject: string;
    instructor_name: string;
    time_formatted: string;
    is_live: boolean;
  }>;
  assignments: Array<{
    id: number | string;
    title: string;
    subject: string;
    due_date: string;
    assignment_type: 'assignment' | 'quiz' | 'practice_set';
    points: number;
  }>;
}

export interface RegisterCoursePayload {
  title: string;
  subject_field: string;
  course_code: string;
  credit_hours: number;
}

export class DashboardService {
  /**
   * Fetches aggregated dashboard overview stats and models from backend API.
   */
  static async getOverview(): Promise<DashboardOverviewResponse> {
    const response = await apiClient.get<DashboardOverviewResponse>('/api/dashboard/overview/');
    return response.data;
  }

  /**
   * Fetches all registered courses from backend API.
   */
  static async getCourses(): Promise<RegisteredCourseItem[]> {
    const response = await apiClient.get<Array<{
      id: number | string;
      title: string;
      subject_field: string;
      course_code: string;
      credit_hours: number;
      progress_percent: number;
    }>>('/api/dashboard/courses/');

    return response.data.map((c) => ({
      id: String(c.id),
      title: c.title,
      subjectField: c.subject_field,
      courseCode: c.course_code,
      creditHours: c.credit_hours,
      progressPercent: c.progress_percent,
      completedLessons: Math.round((c.progress_percent / 100) * 12),
      totalLessons: 12,
      enrolledDate: 'Active',
      status: 'active' as const,
    }));
  }

  /**
   * Enrolls the student into a new course and persists to database.
   */
  static async registerCourse(payload: RegisterCoursePayload): Promise<RegisteredCourseItem> {
    const response = await apiClient.post<{
      id: number | string;
      title: string;
      subject_field: string;
      course_code: string;
      credit_hours: number;
      progress_percent: number;
    }>('/api/dashboard/courses/', payload);

    const c = response.data;
    return {
      id: String(c.id),
      title: c.title,
      subjectField: c.subject_field,
      courseCode: c.course_code,
      creditHours: c.credit_hours,
      progressPercent: c.progress_percent || 0,
      completedLessons: 0,
      totalLessons: 12,
      enrolledDate: 'Just Now',
      status: 'active',
    };
  }

  /**
   * Fetches scheduled live workshops from backend API.
   */
  static async getLiveClasses(): Promise<LiveClassItem[]> {
    const response = await apiClient.get<Array<{
      id: number | string;
      title: string;
      subject: string;
      instructor_name: string;
      time_formatted: string;
      is_live: boolean;
    }>>('/api/dashboard/live-classes/');

    return response.data.map((lc, index) => ({
      id: String(lc.id),
      title: lc.title,
      subject: lc.subject,
      instructorName: lc.instructor_name,
      instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      timeFormatted: lc.time_formatted,
      isLive: lc.is_live,
      attendanceCount: 42 + index * 12,
      bgGradient: index % 2 === 0
        ? 'from-[#3B82F6]/20 via-[#1E1B4B]/30 to-[#0A0F18]'
        : 'from-[#8B5CF6]/20 via-[#1E1B4B]/30 to-[#0A0F18]',
      progressPercent: 75,
      completedLessons: 6,
      totalLessons: 8,
      timeRemaining: '45 mins remaining',
    }));
  }

  /**
   * Fetches academic assignments & quizzes from backend API.
   */
  static async getAssignments(): Promise<AssignmentItem[]> {
    const response = await apiClient.get<Array<{
      id: number | string;
      title: string;
      subject: string;
      due_date: string;
      assignment_type: 'assignment' | 'quiz' | 'practice_set';
      points: number;
    }>>('/api/dashboard/assignments/');

    return response.data.map((a) => ({
      id: String(a.id),
      title: a.title,
      subject: a.subject,
      dueDate: a.due_date,
      status: 'pending' as const,
      points: a.points,
      type: a.assignment_type,
      isUrgent: a.due_date.toLowerCase().includes('2 days') || a.due_date.toLowerCase().includes('today'),
    }));
  }
}

export default DashboardService;
