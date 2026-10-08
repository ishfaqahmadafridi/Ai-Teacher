import { apiClient } from '@/lib/api';
import type { AttendanceHistory } from '../types/progress.types';
import { ATTENDANCE_API_PATH } from '../constants/attendanceConstants';

export const AttendanceService = {
  async history(signal?: AbortSignal): Promise<AttendanceHistory> {
    return (await apiClient.get<AttendanceHistory>(ATTENDANCE_API_PATH, { signal })).data;
  },
  async export(): Promise<Blob> {
    return (await apiClient.get<Blob>(`${ATTENDANCE_API_PATH}export/`, { responseType: 'blob' })).data;
  },
};
