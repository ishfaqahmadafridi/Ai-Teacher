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

export const ACADEMIC_LEVEL_OPTIONS = [
  'High School',
  'Undergraduate',
  'Postgraduate',
  'Doctorate & Research',
];

export const AI_PROFESSOR_AVATARS = [
  { id: 'prof_gemini', name: 'Prof. Gemini', desc: 'Default versatile LLM tutor' },
  { id: 'prof_physics', name: 'Prof. Physics', desc: 'Specialist in mechanics & calculus' },
  { id: 'prof_socratic', name: 'Prof. Socratic', desc: 'Interactive Q&A guidance style' },
] as const;

export const SPEECH_SPEED_RATES = ['0.75', '1.0', '1.25', '1.5'] as const;

export const EXPLANATION_DEPTH_LEVELS = [
  { id: 'beginner', title: 'Beginner', desc: 'Simple step-by-step guidance' },
  { id: 'standard', title: 'Standard', desc: 'Balanced academic depth' },
  { id: 'advanced', title: 'Advanced', desc: 'Rigorous mathematical proofs' },
] as const;

export const THEME_MODE_OPTIONS = [
  { id: 'lumina_dark', title: 'Lumina Dark (Recommended)', desc: 'Sleek dark mode with subtle cyan ambient glows' },
  { id: 'high_contrast_dark', title: 'High Contrast Dark', desc: 'Deep black background with vivid contrast' },
] as const;
