'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardService } from '@/services/dashboardService';
import {
  DEFAULT_REGISTERED_COURSES,
  DEFAULT_LIVE_CLASSES,
  DEFAULT_ASSIGNMENTS,
  DEFAULT_CONTINUE_LEARNING,
} from '../constants/dashboardConstants';
import type { RegisteredCourseItem } from '../types/courses.types';
import type { LiveClassItem } from '../types/dashboard.types';
import type { AssignmentItem } from '../types/dashboard.types';
import type { ContinueLearningCourse } from '../types/dashboard.types';

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registeredCourses, setRegisteredCourses] = useState<RegisteredCourseItem[]>(
    DEFAULT_REGISTERED_COURSES
  );
  const [liveClasses, setLiveClasses] = useState<LiveClassItem[]>(DEFAULT_LIVE_CLASSES);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(DEFAULT_ASSIGNMENTS);
  const [continueLearning, setContinueLearning] = useState<ContinueLearningCourse>(
    DEFAULT_CONTINUE_LEARNING
  );

  // Fetch dynamic data on initial load
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const overview = await DashboardService.getOverview();
      if (overview) {
        if (overview.continue_learning) {
          setContinueLearning(overview.continue_learning);
        }
        if (Array.isArray(overview.courses) && overview.courses.length > 0) {
          setRegisteredCourses(
            overview.courses.map((c) => ({
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
            }))
          );
        }
        if (Array.isArray(overview.live_classes) && overview.live_classes.length > 0) {
          setLiveClasses(
            overview.live_classes.map((lc, index) => ({
              id: String(lc.id),
              title: lc.title,
              subject: lc.subject,
              instructorName: lc.instructor_name,
              instructorAvatar:
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              timeFormatted: lc.time_formatted,
              isLive: lc.is_live,
              attendanceCount: 42 + index * 12,
              bgGradient:
                index % 2 === 0
                  ? 'from-[#3B82F6]/20 via-[#1E1B4B]/30 to-[#0A0F18]'
                  : 'from-[#8B5CF6]/20 via-[#1E1B4B]/30 to-[#0A0F18]',
              progressPercent: 75,
              completedLessons: 6,
              totalLessons: 8,
              timeRemaining: '45 mins remaining',
            }))
          );
        }
        if (Array.isArray(overview.assignments) && overview.assignments.length > 0) {
          setAssignments(
            overview.assignments.map((a) => ({
              id: String(a.id),
              title: a.title,
              subject: a.subject,
              dueDate: a.due_date,
              status: 'pending' as const,
              points: a.points,
              type: a.assignment_type,
              isUrgent:
                a.due_date.toLowerCase().includes('2 days') ||
                a.due_date.toLowerCase().includes('today'),
            }))
          );
        }
      }
    } catch (err) {
      console.warn('[useDashboardData] Backend endpoint unreachable, using client store state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Synchronize onboarding store interest if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedOb = localStorage.getItem('onboarding-store');
        if (storedOb) {
          const parsed = JSON.parse(storedOb);
          const interests: string[] = parsed?.state?.selectedInterests || [];
          if (interests.length > 0) {
            setContinueLearning({
              id: 'c1',
              title: interests.slice(0, 3).join(' & '),
              chapter: '',
              progressPercent: 75,
            });
          }
        }
      } catch (e) {
        console.error('[useDashboardData] Failed to parse onboarding store:', e);
      }
    }
  }, []);

  // Register new course and update live state
  const handleRegisterCourse = useCallback(
    async (courseData: {
      subjectField: string;
      title: string;
      courseCode: string;
      creditHours: number;
    }) => {
      try {
        const newCourse = await DashboardService.registerCourse({
          title: courseData.title,
          subject_field: courseData.subjectField,
          course_code: courseData.courseCode,
          credit_hours: courseData.creditHours,
        });
        setRegisteredCourses((prev) => [newCourse, ...prev]);
      } catch (err) {
        console.warn('[useDashboardData] Register API failed, updating client store optimistically:', err);
        const fallbackItem: RegisteredCourseItem = {
          id: `rc_${Date.now()}`,
          title: courseData.title,
          subjectField: courseData.subjectField,
          courseCode: courseData.courseCode,
          creditHours: courseData.creditHours,
          progressPercent: 0,
          completedLessons: 0,
          totalLessons: 12,
          enrolledDate: 'Just Now',
          status: 'active',
        };
        setRegisteredCourses((prev) => [fallbackItem, ...prev]);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    registeredCourses,
    liveClasses,
    assignments,
    continueLearning,
    setRegisteredCourses,
    handleRegisterCourse,
    reloadDashboardData: loadDashboardData,
  };
}
