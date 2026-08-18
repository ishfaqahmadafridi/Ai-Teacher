export type SettingsTabId = 'ai_mentor' | 'general' | 'study_goals' | 'academic' | 'notifications';

export interface ProjectSettingsState {
  // AI Mentor & Classroom
  aiAvatarModel: 'prof_gemini' | 'prof_physics' | 'prof_socratic';
  speechRate: '0.75' | '1.0' | '1.25' | '1.5';
  voiceStreaming: boolean;
  explanationDepth: 'beginner' | 'standard' | 'advanced';
  autoBlackboardDiagrams: boolean;
  liveSubtitles: boolean;

  // General & Theme
  themeMode: 'lumina_dark' | 'high_contrast_dark';
  interfaceLanguage: string;
  timezone: string;

  // Study Goals & Targets
  dailyStudyGoalHours: number;
  weeklyQuizGoal: number;

  // Academic Profile
  academicLevel: string;
  primaryField: string;
  specialization: string;

  // Notifications & Security
  emailAssignmentAlerts: boolean;
  disruptionWarningsAlerts: boolean;
  soundEffects: boolean;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SettingsTabNavProps {
  activeTab: SettingsTabId;
  onTabChange: (tab: SettingsTabId) => void;
}

export interface SettingsTabProps {
  settings: ProjectSettingsState;
  onChange: <K extends keyof ProjectSettingsState>(field: K, value: ProjectSettingsState[K]) => void;
  className?: string;
}

export interface FieldSelectComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface UseFieldSelectComboboxOptions {
  value: string;
  onChange: (value: string) => void;
}

export interface FieldSearchInputProps {
  query: string;
  isOpen: boolean;
  placeholder?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleOpen: () => void;
  className?: string;
}

export interface FieldDropdownMenuProps {
  isOpen: boolean;
  query: string;
  filteredFields: string[];
  onSelectField: (field: string) => void;
  className?: string;
}

export interface AcademicLevelCardProps {
  academicLevel: string;
  onChangeLevel: (level: string) => void;
  className?: string;
}

export interface PrimaryDisciplineCardProps {
  primaryField: string;
  onChangeField: (field: string) => void;
  className?: string;
}

export interface SpecializationCardProps {
  specialization: string;
  onChangeSpecialization: (specialization: string) => void;
  className?: string;
}

export interface AIAvatarModelCardProps {
  aiAvatarModel: ProjectSettingsState['aiAvatarModel'];
  onChangeModel: (model: ProjectSettingsState['aiAvatarModel']) => void;
  className?: string;
}

export interface SpeechRateCardProps {
  speechRate: ProjectSettingsState['speechRate'];
  onChangeSpeechRate: (rate: ProjectSettingsState['speechRate']) => void;
  className?: string;
}

export interface VoiceStreamingCardProps {
  voiceStreaming: boolean;
  onToggleVoiceStreaming: () => void;
  className?: string;
}

export interface ExplanationDepthCardProps {
  explanationDepth: ProjectSettingsState['explanationDepth'];
  onChangeDepth: (depth: ProjectSettingsState['explanationDepth']) => void;
  className?: string;
}

export interface AutoBlackboardCardProps {
  autoBlackboardDiagrams: boolean;
  onToggleAutoBlackboard: () => void;
  className?: string;
}

export interface ThemeModeCardProps {
  themeMode: ProjectSettingsState['themeMode'];
  onChangeThemeMode: (mode: ProjectSettingsState['themeMode']) => void;
  className?: string;
}

export interface InterfaceLanguageCardProps {
  interfaceLanguage: string;
  onChangeLanguage: (lang: string) => void;
  className?: string;
}

export interface LocalTimezoneCardProps {
  timezone: string;
  onChangeTimezone: (tz: string) => void;
  className?: string;
}
