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
