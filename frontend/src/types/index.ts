// Compatibility barrel: type definitions belong to their owning modules.
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
} from '../features/classroom/types/classroom.types';
export type { AskRole, AskMessage } from '../features/ask/types/ask.types';
export type { User, AuthState, ApiResponse } from '../shared/types';
