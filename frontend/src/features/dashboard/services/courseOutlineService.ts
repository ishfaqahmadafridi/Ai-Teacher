import { apiClient } from '@/lib/api';
import type { CourseOutline } from '../types/courses.types';
import { courseOutlineSchema } from '../validators/courseOutline.schema';
export const courseOutlineService = {
  async read(id: string, signal?: AbortSignal): Promise<CourseOutline> {
    return courseOutlineSchema.parse((await apiClient.get(`/api/dashboard/courses/${encodeURIComponent(id)}/outline/`, { signal })).data);
  },
  async generate(id: string, signal?: AbortSignal): Promise<CourseOutline> {
    return courseOutlineSchema.parse((await apiClient.post(`/api/dashboard/courses/${encodeURIComponent(id)}/outline/generate/`, {}, { signal, timeout: 45000 })).data);
  },
  async save(id: string, data: Pick<CourseOutline, 'topics' | 'source'>, signal?: AbortSignal): Promise<CourseOutline> {
    return courseOutlineSchema.parse((await apiClient.put(`/api/dashboard/courses/${encodeURIComponent(id)}/outline/`, data, { signal })).data);
  },
};
