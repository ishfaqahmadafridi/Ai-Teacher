import { apiClient } from '@/lib/api';
import { lessonAttemptSchema, lessonEvaluationSchema } from '../validators/lesson.schema';
import { savedLectureNoteSchema, savedLectureNotesSchema } from '../validators/notes.schema';
export const lectureNotesService = {
  async answer(id: string, sectionIndex: number, answer: string, requestId: string) {
    const response = await apiClient.post(`/api/notes/${id}/answers/`, {
      section_index: sectionIndex, answer, request_id: requestId,
    });
    return lessonAttemptSchema.parse(response.data);
  },
  async evaluate(id: string, attemptId: string) {
    const response = await apiClient.post(`/api/notes/${id}/answers/${attemptId}/evaluate/`);
    return lessonEvaluationSchema.parse(response.data.evaluation);
  },
  async list(signal?: AbortSignal) {
    const response = await apiClient.get<unknown>('/api/notes/', { signal });
    return savedLectureNotesSchema.parse(response.data);
  },
  async translate(id: string, language: string) {
    const response = await apiClient.post<unknown>(`/api/notes/${id}/translate/`, { language }, { timeout: 120_000 });
    return savedLectureNoteSchema.parse(response.data);
  },
  async figure(id: string, index: number, signal?: AbortSignal) {
    const response = await apiClient.get<Blob>(`/api/notes/${id}/figures/`, { params: { section_index: index }, responseType: 'blob', signal });
    return response.data;
  },
  async document(id: string, language: string) {
    const response = await apiClient.get<Blob>(`/api/notes/${id}/document/`, { params: { language }, responseType: 'blob' });
    return response.data;
  },
};
export async function saveLectureFigure(id: string, sectionIndex: number, image: string, signal: AbortSignal) {
  await apiClient.post(`/api/notes/${id}/figures/`, { section_index: sectionIndex, image }, { signal });
}
