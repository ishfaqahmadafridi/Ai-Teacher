'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { AttendanceService } from '../services/attendanceService';
import { ATTENDANCE_REFRESH_INTERVAL, ATTENDANCE_EXPORT_FILENAME } from '../constants/attendanceConstants';
import { useAuthStore } from '@/features/auth/state/authStore';

export function useAttendanceHistory(enabled = true) {
  const userId = useAuthStore((state) => state.user?.id);
  const query = useQuery({
    queryKey: ['attendance-history', userId],
    enabled: enabled && Boolean(userId),
    refetchInterval: ATTENDANCE_REFRESH_INTERVAL,
    queryFn: ({ signal }) => AttendanceService.history(signal),
  });
  const exportMutation = useMutation({ mutationFn: async () => {
    const data = await AttendanceService.export();
    if (useAuthStore.getState().user?.id !== userId) return;
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = ATTENDANCE_EXPORT_FILENAME;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } });
  return { ...query, download: () => exportMutation.mutate(), downloadError: exportMutation.isError };
}
