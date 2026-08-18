import type { ProjectSettingsState, SettingsTabId } from '../types/settings.types';

export const DEFAULT_PROJECT_SETTINGS: ProjectSettingsState = {
  voiceStreaming: true,
  explanationDepth: 'standard',
  autoBlackboardDiagrams: true,

  themeMode: 'lumina_dark',
  interfaceLanguage: 'English',
  timezone: '(UTC+05:00) Islamabad, Karachi',

  emailAssignmentAlerts: true,
  disruptionWarningsAlerts: true,
  soundEffects: true,

  academicLevel: 'Undergraduate',
  primaryField: 'Computer Science & IT',
};

export const SETTINGS_TABS: { id: SettingsTabId; label: string; icon: string }[] = [
  { id: 'ai_mentor', label: 'AI Mentor & Voice', icon: 'Bot' },
  { id: 'general', label: 'General & Lumina Theme', icon: 'Sliders' },
  { id: 'notifications', label: 'Notifications & Security', icon: 'Bell' },
  { id: 'academic', label: 'Academic & Major', icon: 'GraduationCap' },
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
