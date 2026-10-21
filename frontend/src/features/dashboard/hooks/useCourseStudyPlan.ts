'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/state/authStore';
import { courseOutlineService } from '../services/courseOutlineService';
import type { CourseStudyPlanModalProps } from '../types/courses.types';

export function useCourseStudyPlan({ courses, initialCourseId }: CourseStudyPlanModalProps) {
  const [courseId, setCourseId] = useState(initialCourseId ?? courses[0]?.id ?? '');
  const userId = useAuthStore(state => state.user?.id);
  const course = courses.find(item => item.id === courseId);
  const outline = useQuery({
    queryKey: ['course-study-plan', userId, courseId],
    queryFn: ({ signal }) => courseOutlineService.read(courseId, signal),
    enabled: Boolean(userId && course),
  });
  return { courseId, setCourseId, course, outline: outline.data, isLoading: outline.isPending, error: outline.isError };
}
