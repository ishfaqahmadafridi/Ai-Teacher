import { COURSE_OUTLINE_GENERATION_TIMEOUT_MS } from '../constants/courseOutlineConstants';
import { apiClient } from '@/lib/api';
import type { CourseOutline } from '../types/courses.types';
import { courseOutlineSchema } from '../validators/courseOutline.schema';
export const courseOutlineService = {
  async read(id: string, signal?: AbortSignal): Promise<CourseOutline> {
    return courseOutlineSchema.parse((await apiClient.get(`/api/dashboard/courses/${encodeURIComponent(id)}/outline/`, { signal })).data);
  },
  async generate(id: string, signal?: AbortSignal): Promise<CourseOutline> {
    return courseOutlineSchema.parse((await apiClient.post(`/api/dashboard/courses/${encodeURIComponent(id)}/outline/generate/`, {}, { signal, timeout: COURSE_OUTLINE_GENERATION_TIMEOUT_MS })).data);
  },
  async save(id: string, data: Pick<CourseOutline, 'topics' | 'source' | 'details'>, signal?: AbortSignal): Promise<CourseOutline> {
    return courseOutlineSchema.parse((await apiClient.put(`/api/dashboard/courses/${encodeURIComponent(id)}/outline/`, data, { signal })).data);
  },
};
