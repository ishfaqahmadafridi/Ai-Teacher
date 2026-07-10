// ─── Central constants — never hardcode these in components ──────────────────

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export const SESSION_STORAGE_KEY = 'ai_teacher_session_id';

export const DIAGRAM_TYPES = [
  'gravity',
  'electric_field',
  'projectile',
  'wave',
  'circuit',
  'atom',
  'image',
  'default',
] as const;

export const ASK_SUGGESTIONS = [
  "Explain Newton's laws of motion",
  'How does gravity work?',
  'What is projectile motion?',
  'Explain electric fields and field lines',
  "What is Ohm's Law?",
  'How does atomic structure work?',
  'Explain wave motion and frequency',
  'What is the speed of light?',
  'Explain conservation of energy',
  'What is quantum mechanics?',
  'How do lenses focus light?',
  'Explain the photoelectric effect',
] as const;

export const TEACHER_POSITIONS = ['left', 'right', 'center'] as const;

export const BOARD_LAYOUT = {
  chalkboard: { y: 0.45, z: -1.2, height: 3.8, width: 8.5 },
  mediaScreen: { x: 2.7, y: 0.45, z: -1.2, width: 2.6, height: 3.6 },
  teacher: { y: -1.4, z: 1.2, scale: 1.4 },
} as const;
