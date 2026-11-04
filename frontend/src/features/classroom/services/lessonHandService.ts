import { apiClient } from '@/lib/api';
import { lessonHandSchema } from '../validators/lesson.schema';

export const lessonHandService = {
  async read(noteId: string, signal?: AbortSignal) {
    return lessonHandSchema.parse((await apiClient.get(`/api/notes/${noteId}/hand/`, { signal })).data);
  },
  async set(noteId: string, raised: boolean, signal?: AbortSignal) {
    return lessonHandSchema.parse((await apiClient.put(`/api/notes/${noteId}/hand/`, { hand_raised: raised }, { signal })).data);
  },
};
