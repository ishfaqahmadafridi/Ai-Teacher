import type { ClassPhase } from './session.types';
import type { z } from 'zod';
import type { classroomChunkSchema, diagramCommandSchema, diagramTypeSchema, phaseSchema, teachingResponseSchema } from '../validators/classroom.schema';

// Infer API contracts from the same schemas used to validate network responses.
export type DiagramCommand = z.infer<typeof diagramCommandSchema>;
export type DiagramType = z.infer<typeof diagramTypeSchema>;
export type Phase = z.infer<typeof phaseSchema>;
export type TeachingResponse = z.infer<typeof teachingResponseSchema>;
export type ExtendedChunk = z.infer<typeof classroomChunkSchema>;
export type Chunk = Pick<ExtendedChunk, 'speak' | 'diagram' | 'key_point'>;

export type BallMove = 'to_launch' | 'rise' | 'pause_apex' | 'fall' | 'land' | 'loop' | 'none';

export interface SerializedVoice {
  name: string;
  voiceURI: string;
  lang: string;
  localService: boolean;
}

export interface PendingLessonQuestion { sectionIndex: number; question: string; kind?: 'discussion'; expiresAt?: number }

export interface ClassroomState {
  handRaised?: boolean;
  answerSubmitting?: boolean;
  discussionExpired?: boolean;
  classPhase?: ClassPhase;
  courseTitle?: string;
  scheduledSessionId?: string | null;
  pendingQuestion: PendingLessonQuestion | null;
  noteId: string | null;
  inputText: string;
  loading: boolean;
  loadingStatus: string;
  error: string | null;
  chunks: ExtendedChunk[];
  diagramType: DiagramType;
  currentCommand: DiagramCommand | null;
  currentFormula: string | null;
  voices: SerializedVoice[];
  selectedVoice: string;
  chalkboardPoints: string[];
  teacherPosition: 'left' | 'right' | 'center';
  isWritingOnBoard: boolean;
  isPaused: boolean;
  topic: string;
  isPlaying: boolean;
  currentChunkIndex: number;
  spokenText: string;
  isListening: boolean;
  voiceError: string | null;
  showSubtitles: boolean;
}
