import type { z } from 'zod';
import type { classroomAnswerSchema } from '../validators/classroom.schema';

export type ClassroomAnswer = z.infer<typeof classroomAnswerSchema>;
export interface ClassroomQuestion { scheduledSessionId?: string | null; question: string; sessionId: string; signal?: AbortSignal; onStatus?: (status: string) => void }
export interface ClassroomHealth { status: string; model: string; rag: { active: boolean; dataset: string; status: string } }

export interface UseClassroomApiOptions { recoverPending?: boolean }

export interface LessonAnswerRequest { key: string; id: string }
