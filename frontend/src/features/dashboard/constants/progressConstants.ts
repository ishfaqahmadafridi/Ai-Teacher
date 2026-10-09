import type {
  StudentBehaviorMetrics,
  StudentQuestionItem,
  AttendanceLogRecord,
} from '../types/progress.types';

export const DEFAULT_BEHAVIOR_METRICS: StudentBehaviorMetrics = {
  conductScore: 0,
  disruptionWarningsCount: 0,
  maxAllowedWarnings: 3,
  focusLevelPercent: 0,
  interactionQualityPercent: 0,
  lastIncidentNote: '',
  bannedMessage: 'ACCOUNT & EMAIL BANNED — Exceeded maximum 3/3 disruption warnings. Misbehavior is strictly not allowed in the app. Fines or payments are NOT accepted for misbehavior.',
};

export const DEFAULT_TEACHER_QUESTIONS: StudentQuestionItem[] = [];

export const DEFAULT_ATTENDANCE_LOGS: AttendanceLogRecord[] = [];
