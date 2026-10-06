import type { DashboardOverviewResponse } from '@/services/dashboardService';
import { COURSE_LESSON_COUNT, LIVE_CLASS_DISPLAY_DEFAULTS } from '../constants/dashboardDataConstants';

export function mapDashboardCourse(c: DashboardOverviewResponse['courses'][number]) {
  return {
    id: String(c.id), title: c.title, subjectField: c.subject_field,
    courseCode: c.course_code, creditHours: c.credit_hours,
    progressPercent: c.progress_percent,
    completedLessons: Math.round((c.progress_percent / 100) * COURSE_LESSON_COUNT),
    totalLessons: COURSE_LESSON_COUNT, enrolledDate: 'Active', status: 'active' as const,
  };
}
export function mapDashboardLiveClass(lc: DashboardOverviewResponse['live_classes'][number], index: number) {
  const defaults = LIVE_CLASS_DISPLAY_DEFAULTS;
  return {
    id: String(lc.id), title: lc.title, subject: lc.subject,
    instructorName: lc.instructor_name, instructorAvatar: defaults.instructorAvatar,
    timeFormatted: lc.time_formatted, isLive: lc.is_live,
    attendanceCount: defaults.attendanceCount + index * defaults.attendanceIncrement,
    bgGradient: defaults.gradients[index % defaults.gradients.length],
    progressPercent: defaults.progressPercent, completedLessons: defaults.completedLessons,
    totalLessons: defaults.totalLessons, timeRemaining: defaults.timeRemaining,
  };
}
export function mapDashboardAssignment(a: DashboardOverviewResponse['assignments'][number]) {
  return {
    id: String(a.id), title: a.title, subject: a.subject, dueDate: a.due_date,
    status: 'pending' as const, points: a.points, type: a.assignment_type,
    isUrgent: a.due_date.toLowerCase().includes('2 days') || a.due_date.toLowerCase().includes('today'),
  };
}
export function mapDashboardOverview(overview: DashboardOverviewResponse) {
  return {
    registeredCourses: overview.courses.map(mapDashboardCourse),
    liveClasses: overview.live_classes.map(mapDashboardLiveClass),
    assignments: overview.assignments.map(mapDashboardAssignment),
    continueLearning: overview.continue_learning,
  };
}
