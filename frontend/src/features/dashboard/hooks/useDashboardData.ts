'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardService } from '@/services/dashboardService';
import { useAuthStore } from '@/features/auth/state/authStore';
import { queryKeys } from '@/shared/constants/queryConstants';
import { mapDashboardOverview } from '../utilities/dashboardDataUtils';
import type { RegisterCourseModalProps } from '../types/courses.types';

export function useDashboardData() {
  const userId = useAuthStore(state => state.user?.id);
  const client = useQueryClient();
  const overview = useQuery({
    queryKey: queryKeys.dashboard(userId), enabled: !!userId,
    queryFn: ({ signal }) => DashboardService.getOverview(signal),
    select: mapDashboardOverview,
  });
  const registration = useMutation({
    mutationFn: async (courseData: Parameters<RegisterCourseModalProps['onRegisterCourse']>[0]) => {
      const account = useAuthStore.getState().user?.id;
      if (!account || account !== userId) throw new Error('Please sign in before registering a course.');
      const course = await DashboardService.registerCourse({
        title: courseData.title, subject_field: courseData.subjectField,
        course_code: courseData.courseCode, credit_hours: courseData.creditHours,
      });
      if (useAuthStore.getState().user?.id !== account) throw new Error('The signed-in account changed.');
      await client.invalidateQueries({ queryKey: queryKeys.account(account) });
      return course;
    },
  });
  const handleRegisterCourse = async (data: Parameters<RegisterCourseModalProps['onRegisterCourse']>[0]) => {
    await registration.mutateAsync(data);
  };
  return {
    isLoading: overview.isLoading,
    error: (registration.error ?? overview.error)?.message ?? null,
    registeredCourses: overview.data?.registeredCourses ?? [],
    liveClasses: overview.data?.liveClasses ?? [],
    assignments: overview.data?.assignments ?? [],
    continueLearning: overview.data?.continueLearning ?? undefined,
    handleRegisterCourse,
    reloadDashboardData: overview.refetch,
  };
}
