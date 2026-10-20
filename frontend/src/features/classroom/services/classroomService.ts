import { readPendingLessonJob, savePendingLessonJob, clearPendingLessonJob } from '../utilities/pendingLessonJob';
import { lessonJobSchema } from '../validators/lessonJob.schema';
import { waitForLessonJob } from '../utilities/waitForLessonJob';
import { LESSON_JOB_POLL_MS, LESSON_JOB_POLL_JITTER_MS, LESSON_JOB_WAIT_MS, LESSON_JOB_QUEUE_WAIT_MS } from '../constants/lessonJobConstants';
import { apiClient } from '@/lib/api';
import { isAxiosError } from 'axios';
import type { ClassroomAnswer, ClassroomQuestion, ClassroomHealth } from '../types/api.types';
import { classroomAnswerSchema, teachingResponseSchema } from '../validators/classroom.schema';
import type { ValidatedTeachingResponse } from '../validators/classroom.schema';

export class ClassroomService {
  static async askQuestion({ question, sessionId, signal, onStatus }: ClassroomQuestion): Promise<ClassroomAnswer> {
    const pending = readPendingLessonJob(sessionId);
    onStatus?.(pending?.question === question ? 'Reconnecting to your saved lesson…' : 'Submitting your lesson request…');
    const submit = () => apiClient.post<unknown>('/api/lesson-jobs/', {
      question, session_id: sessionId, research: true, request_id: crypto.randomUUID(),
    }, { signal });
    let submission;
    if (pending?.question === question) {
      try {
        submission = await apiClient.get<unknown>(`/api/lesson-jobs/${pending.id}/`, { signal });
      } catch (error) {
        if (!isAxiosError(error) || error.response?.status !== 404) throw error;
        clearPendingLessonJob(sessionId);
        submission = await submit();
      }
    } else submission = await submit();
    let job = lessonJobSchema.parse(submission.data);
    savePendingLessonJob(sessionId, job.id, question);
    const deadline = Date.now() + LESSON_JOB_WAIT_MS;
    let queuedSince = Date.now();
    while (job.status === 'queued' || job.status === 'processing') {
      if (job.status === 'processing') queuedSince = Date.now();
      if (job.status === 'queued' && Date.now() - queuedSince >= LESSON_JOB_QUEUE_WAIT_MS) {
        throw new Error('Your lesson is still queued. Please try again shortly. If this continues, the lesson worker may be offline.');
      }
      onStatus?.(job.status === 'queued' ? 'Your lesson is queued…' : 'Preparing your lesson and visuals…');
      if (Date.now() >= deadline) throw new Error('Lesson preparation is taking longer than expected. Please check again shortly.');
      await waitForLessonJob(LESSON_JOB_POLL_MS + Math.random() * LESSON_JOB_POLL_JITTER_MS, signal);
      const response = await apiClient.get<unknown>(`/api/lesson-jobs/${job.id}/`, { signal });
      job = lessonJobSchema.parse(response.data);
    }
    clearPendingLessonJob(sessionId);
    if (job.status === 'failed') throw new Error(job.error || 'Lesson preparation failed. Please try again.');
    return classroomAnswerSchema.parse(job.result);
  }

  /**
   * Healthcheck to verify the backend and API keys are configured.
   */
  static async checkHealth(signal?: AbortSignal): Promise<ClassroomHealth> {
    const response = await apiClient.get<ClassroomHealth>('/api/health/', { signal });
    return response.data;
  }

  /**
   * Safe parser to validate the JSON object returned from the SSE explanation stream.
   * Leverages the classroom Zod schema validation rules.
   */
  static validateExplanation(data: unknown): ValidatedTeachingResponse {
    return teachingResponseSchema.parse(data);
  }
}

export default ClassroomService;
