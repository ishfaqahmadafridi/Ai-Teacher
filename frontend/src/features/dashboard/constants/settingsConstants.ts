import type { ProjectSettingsState, SettingsTabId } from '../types/settings.types';

export const DEFAULT_PROJECT_SETTINGS: ProjectSettingsState = {
  aiAvatarModel: 'prof_gemini',
  speechRate: '1.0',
  voiceStreaming: true,
  explanationDepth: 'standard',
  autoBlackboardDiagrams: true,
  liveSubtitles: true,

  themeMode: 'lumina_dark',
  interfaceLanguage: 'English',
  timezone: '(UTC+05:00) Islamabad, Karachi',

  dailyStudyGoalHours: 2,
  weeklyQuizGoal: 5,

  academicLevel: 'Undergraduate',
  primaryField: 'Computer Science & IT',
  specialization: 'Artificial Intelligence & Systems',

  emailAssignmentAlerts: true,
  disruptionWarningsAlerts: true,
  soundEffects: true,
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const SETTINGS_TABS: { id: SettingsTabId; label: string; icon: string }[] = [
  { id: 'ai_mentor', label: 'AI Mentor & Voice', icon: 'Bot' },
  { id: 'general', label: 'General & Lumina Theme', icon: 'Sliders' },
  { id: 'study_goals', label: 'Daily Goals & Targets', icon: 'Target' },
  { id: 'academic', label: 'Academic & Major', icon: 'GraduationCap' },
  { id: 'notifications', label: 'Security & Notifications', icon: 'ShieldCheck' },
];

export const AVAILABLE_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Urdu',
  'Chinese (Simplified)',
  'Arabic',
];

export const AVAILABLE_TIMEZONES = [
  '(UTC+05:00) Islamabad, Karachi',
  '(UTC+00:00) UTC / GMT',
  '(UTC-05:00) Eastern Time (US & Canada)',
  '(UTC-08:00) Pacific Time (US & Canada)',
  '(UTC+01:00) Central European Time',
  '(UTC+08:00) Beijing, Singapore',
];

export const PRESET_ACADEMIC_FIELDS = [
  'Computer Science & IT',
  'Software Engineering & AI',
  'Medical & Healthcare',
  'Pure & Applied Sciences',
  'Physics & Quantum Mechanics',
  'Humanities & Social Sciences',
  'Business & Design',
  'Robotics & Automation',
  'Data Science & Analytics',
  'Biomedical Engineering',
];
