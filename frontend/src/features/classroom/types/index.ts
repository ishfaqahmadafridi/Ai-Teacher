/**
 * features/classroom/types/index.ts
 *
 * Barrel export for all classroom feature TypeScript types.
 * Import from this file instead of the concrete module:
 *   import type { DiagramCommand } from '@/features/classroom/types';
 */
export type {
  DiagramCommand,
  DiagramType,
  Phase,
  TeachingResponse,
  Chunk,
  ExtendedChunk,
  BallMove,
  SerializedVoice,
  ClassroomState,
} from './classroom.types';
