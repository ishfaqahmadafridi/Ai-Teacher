export type SettingsTabId = 'ai_mentor' | 'general' | 'notifications' | 'academic';

export interface ProjectSettingsState {
  // AI Mentor & Classroom
  voiceStreaming: boolean;
  explanationDepth: 'beginner' | 'standard' | 'advanced';
  autoBlackboardDiagrams: boolean;

  // General & Theme
  themeMode: 'lumina_dark' | 'high_contrast_dark';
  interfaceLanguage: string;
  timezone: string;

  // Notifications & Security
  emailAssignmentAlerts: boolean;
  disruptionWarningsAlerts: boolean;
  soundEffects: boolean;

  // Academic Profile
  academicLevel: string;
  primaryField: string;
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
