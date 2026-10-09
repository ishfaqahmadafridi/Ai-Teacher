import { mapDashboardCourse, mapDashboardLiveClass, mapDashboardAssignment } from '@/features/dashboard/utilities/dashboardDataUtils';
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
  continue_learning: ContinueLearningCourse | null;
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
  static async getOverview(signal?: AbortSignal): Promise<DashboardOverviewResponse> {
    const response = await apiClient.get<DashboardOverviewResponse>('/api/dashboard/overview/', { signal });
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

    return response.data.map(mapDashboardCourse);
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

    return { ...mapDashboardCourse(response.data), completedLessons: 0, enrolledDate: 'Just Now' };
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

    return response.data.map(mapDashboardLiveClass);
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

    return response.data.map(mapDashboardAssignment);
  }
}

export default DashboardService;
