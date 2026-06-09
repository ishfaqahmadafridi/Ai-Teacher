import { type Chunk, type DiagramCommand } from '../../hooks/classroom/useChunkPlayer';
import { type DiagramType } from '../../components/DiagramStage';

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
}

export interface ExtendedChunk extends Chunk {
  teacher_position?: 'left' | 'right' | 'center';
}

export interface TopbarProps {
  topic: string;
  diagramType: DiagramType;
  loading: boolean;
  loadingStatus: string;
  isPlaying: boolean;
  chunks: ExtendedChunk[];
  currentChunkIndex: number;
  isPaused: boolean;
  handlePause: () => void;
  handleStop: () => void;
  lectureMode: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  handleNewSession: () => void;
}

export interface TopbarControlsProps {
  isPlaying: boolean;
  chunks: ExtendedChunk[];
  currentChunkIndex: number;
  isPaused: boolean;
  handlePause: () => void;
  handleStop: () => void;
  lectureMode: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  handleNewSession: () => void;
}

export interface MainStageProps {
  topic: string;
  diagramType: DiagramType;
  loading: boolean;
  loadingStatus: string;
  isPlaying: boolean;
  chunks: ExtendedChunk[];
  currentChunkIndex: number;
  isPaused: boolean;
  handlePause: () => void;
  handleStop: () => void;
  lectureMode: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  handleNewSession: () => void;
  askQuestion: (q: string) => void;
  currentCommand: DiagramCommand | null;
  currentFormula: string | null;
  chalkboardPoints: string[];
  teacherPosition: 'left' | 'right' | 'center';
  isWritingOnBoard: boolean;
  spokenText: string;
  error: string | null;
  setError: (err: string | null) => void;
  voiceError: string | null;
  isListening: boolean;
  inputText: string;
  setInputText: (text: string) => void;
  handleMicClick: () => void;
}

export interface SidebarProps {
  loading: boolean;
  isPlaying: boolean;
  loadingStatus: string;
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  askQuestion: (question: string) => void;
  handleNewSession: () => void;
  lectureMode: boolean;
}

export interface SubtitleContainerProps {
  isPlaying: boolean;
  spokenText: string;
  currentChunkIndex: number;
}

export interface ErrorBarProps {
  error: string | null;
  setError: (error: string | null) => void;
}

export interface VoiceErrorBarProps {
  voiceError: string | null;
}

export interface WelcomeOverlayProps {
  chunks: ExtendedChunk[];
  loading: boolean;
  askQuestion: (question: string) => void;
}

export interface LoadingOverlayProps {
  loading: boolean;
  loadingStatus: string;
}

export interface KeyPointsPanelProps {
  isPlaying: boolean;
  chalkboardPoints: string[];
}

export interface BoardAreaProps {
  lectureMode: boolean;
  chunks: ExtendedChunk[];
  loading: boolean;
  loadingStatus: string;
  askQuestion: (question: string) => void;
  diagramType: DiagramType;
  currentCommand: DiagramCommand | null;
  currentFormula: string | null;
  chalkboardPoints: string[];
  isPlaying: boolean;
  teacherPosition: 'left' | 'right' | 'center';
  isWritingOnBoard: boolean;
}

export interface ChalkboardStageProps extends BoardAreaProps {}




