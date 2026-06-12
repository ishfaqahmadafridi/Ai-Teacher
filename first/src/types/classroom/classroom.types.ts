export interface DiagramCommand {
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

export interface Chunk {
  speak: string;
  diagram?: DiagramCommand;
  key_point?: string | null;
}

export type BallMove = 'to_launch' | 'rise' | 'pause_apex' | 'fall' | 'land' | 'loop' | 'none';

export interface SerializedVoice {
  name: string;
  voiceURI: string;
  lang: string;
  localService: boolean;
}

export interface ClassroomState {
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

export interface DiagramStageProps {
  diagramType: DiagramType;
  command: DiagramCommand | null;
  formula: string | null;
}

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
  voices: SerializedVoice[];
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
  voices: SerializedVoice[];
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
  voices: SerializedVoice[];
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
  voices: SerializedVoice[];
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

export interface SceneProps {
  type: DiagramType;
  command: DiagramCommand | null;
}

export interface FormulaOverlayProps {
  command: DiagramCommand | null;
  formula: string | null;
}

export type TeacherPos = 'left' | 'right' | 'center';

export interface TeacherFigureProps {
  position: TeacherPos;
  isPlaying: boolean;
  isWriting: boolean;
}

export interface ChalkboardBackgroundProps {
  lectureMode: boolean;
}

export interface ChalkTextProps {
  points: string[];
  isPlaying: boolean;
}


export interface ProfessorCardProps {
  loading: boolean;
  loadingStatus: string;
  isPlaying: boolean;
}

export interface VoiceSelectorProps {
  voices: SerializedVoice[];
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
}

export interface SuggestionsListProps {
  askQuestion: (question: string) => void;
  loading: boolean;
  isPlaying: boolean;
}


export interface MobileSuggestionsProps {
  askQuestion: (question: string) => void;
}


export interface ImageSceneProps {
  command: DiagramCommand | null;
  url: string;
}

export interface AnimatedImageCardProps {
  url: string;
  command: DiagramCommand | null;
}

export interface SavedAnnotation {
  text: string;
  position: 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'center';
}

export interface ImageAnnotationsProps {
  annotations: SavedAnnotation[];
}

export type AskRole = 'user' | 'assistant';

export interface AskMessage {
  id: string;
  role: AskRole;
  content: string;
}

export interface AskVoice {
  name: string;
  lang: string;
  uri?: string;
}

export interface AskSidebarProps {
  sendMessage: (text: string) => Promise<void>;
  handleNewChat: () => Promise<void>;
}

export interface AskChatHeaderProps {
  voices: AskVoice[];
  selectedVoice: string | null;
  setSelectedVoice: (voice: string) => void;
  autoSpeak: boolean;
  setAutoSpeak: (checked: boolean) => void;
  handleNewChat: () => Promise<void>;
}

export interface AskWelcomeScreenProps {
  sendMessage: (text: string) => Promise<void>;
}

export interface AskMessageListProps {
  messages: AskMessage[];
  loading: boolean;
  error: string | null;
  speakingId: string | null;
  toggleSpeak: (id: string, content: string) => void;
  sendMessage: (text: string) => Promise<void>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

export interface AskInputBarProps {
  input: string;
  setInput: (text: string) => void;
  loading: boolean;
  sendMessage: (text: string) => Promise<void>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  resizeTextarea: () => void;
}

export interface AskChatPanelProps {
  voices: AskVoice[];
  selectedVoice: string | null;
  setSelectedVoice: (voice: string) => void;
  autoSpeak: boolean;
  setAutoSpeak: (checked: boolean) => void;
  handleNewChat: () => Promise<void>;
  messages: AskMessage[];
  loading: boolean;
  error: string | null;
  speakingId: string | null;
  toggleSpeak: (id: string, content: string) => void;
  sendMessage: (text: string) => Promise<void>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  input: string;
  setInput: (text: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  resizeTextarea: () => void;
}

export interface AskChatSettingsProps {
  voices: AskVoice[];
  selectedVoice: string | null;
  setSelectedVoice: (voice: string) => void;
  autoSpeak: boolean;
  setAutoSpeak: (checked: boolean) => void;
  handleNewChat: () => Promise<void>;
}

export interface AskTextareaProps {
  input: string;
  setInput: (text: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  resizeTextarea: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export interface AskSubmitButtonProps {
  loading: boolean;
  disabled: boolean;
}

export interface AskMessageItemProps {
  msg: AskMessage;
  speakingId: string | null;
  toggleSpeak: (id: string, content: string) => void;
  sendMessage: (text: string) => Promise<void>;
}

export interface AskTypingIndicatorProps {
  loading: boolean;
}

export interface AskErrorMessageProps {
  error: string | null;
}

export interface AskMessageAvatarProps {
  role: AskRole;
}

export interface AskMessageBubbleProps {
  role: AskRole;
  content: string;
}

export interface AskMessageActionsProps {
  msgId: string;
  msgContent: string;
  speakingId: string | null;
  toggleSpeak: (id: string, content: string) => void;
  sendMessage: (text: string) => Promise<void>;
}

export interface AskListenButtonProps {
  msgId: string;
  msgContent: string;
  speakingId: string | null;
  toggleSpeak: (id: string, content: string) => void;
}

export interface AskDifferentAnalogyButtonProps {
  sendMessage: (text: string) => Promise<void>;
}

export interface AskGotItButtonProps {
  sendMessage: (text: string) => Promise<void>;
}

export interface SubtitleBarProps {
  text: string;
  isPlaying: boolean;
  chunkIndex: number;
}

export interface TeacherSvgProps {
  bodyBob: number;
  armAngle: number;
  isWriting: boolean;
  isWalking: boolean;
  flip: number;
}

export interface TeacherLeftArmProps {
  armAngle: number;
  isWriting: boolean;
}

export interface TeacherLegsProps {
  isWalking: boolean;
}












