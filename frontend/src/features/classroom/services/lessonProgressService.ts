import { apiClient } from '@/lib/api';
import { lessonProgressSchema } from '../validators/lesson.schema';
export const lessonProgressService = {
  async read(noteId: string, signal?: AbortSignal) {
    return lessonProgressSchema.parse((await apiClient.get(`/api/notes/${noteId}/progress/`, { signal })).data);
  },
  async wait(noteId: string, sectionIndex: number, revision: number, signal?: AbortSignal) {
    return lessonProgressSchema.parse((await apiClient.put(`/api/notes/${noteId}/progress/`, { section_index: sectionIndex, waiting: true, revision }, { signal })).data);
  },
};
