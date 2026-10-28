import type { CircuitParameters } from './circuit.types';

export interface DiagramCommand {
  visual_reason?: string;
  visual?: { kind: 'tree'; nodes: { id: string; label: string; parent?: string | null }[] } | { kind: 'polynomial'; coefficients: number[]; x_min: number; x_max: number };
  image_query?: string;
  visual_status?: 'retrieved' | 'unavailable';
  parameters?: CircuitParameters;
  action:
    | 'none'
    | 'highlight'
    | 'rotate'
    | 'zoom'
    | 'zoom_in'
    | 'zoom_out'
    | 'show_formula'
    | 'show_formula_stepwise'
    | 'show_initial'
    | 'add_arrow'
    | 'add_label'
    | 'pause_and_highlight'
    | 'pause_and_explain';
  target?: string;
  speed?: 'slow' | 'fast';
  formula?: string;
  animate?: { object: string; move: string; speed: string };
  annotation?: string;
  annotation_position?: string;
}

export type DiagramType =
  | 'gravity'
  | 'electric_field'
  | 'projectile'
  | 'wave'
  | 'circuit'
  | 'atom'
  | 'image'
  | 'default';

export interface Phase {
  phase: number;
  name: string;
  diagram_action: string;
  diagram_target?: string;
  speak: string;
  key_point?: string | null;
  joke?: string | null;
  animate?: { object: string; move: string; speed: string };
  formulas?: { line: number; speak: string; display: string }[];
  wait_for_answer?: boolean;
  annotation?: string;
  annotation_position?: string;
  teacher_position?: 'left' | 'right' | 'center';
}

export interface TeachingResponse {
  topic: string;
  language: string;
  diagram_type: string;
  phases: Phase[];
  topic_map?: string[];
}

export interface Chunk {
  speak: string;
  diagram?: DiagramCommand;
  key_point?: string | null;
}

export interface ExtendedChunk extends Chunk {
  question?: string;
  expected_concepts?: string[];
  teacher_position?: 'left' | 'right' | 'center';
}

export type BallMove = 'to_launch' | 'rise' | 'pause_apex' | 'fall' | 'land' | 'loop' | 'none';

export interface SerializedVoice {
  name: string;
  voiceURI: string;
  lang: string;
  localService: boolean;
}

export interface PendingLessonQuestion { sectionIndex: number; question: string }

export interface ClassroomState {
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
