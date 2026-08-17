export interface StudentBehaviorMetrics {
  conductScore: number;
  disruptionWarningsCount: number;
  maxAllowedWarnings: number;
  focusLevelPercent: number;
  interactionQualityPercent: number;
  lastIncidentNote?: string;
  isBanned?: boolean;
  bannedMessage?: string;
}

export interface StudentQuestionItem {
  id: string;
  questionText: string;
  topicName: string;
  timestampFormatted: string;
  className: string;
  isRelevant: boolean;
  teacherResponse?: string;
  disruptionTag?: 'relevant' | 'off_topic' | 'distraction';
}

export interface AttendanceLogRecord {
  id: string;
  dateFormatted: string;
  className: string;
  subject: string;
  status: 'present' | 'absent' | 'late';
  missedReason?: string;
}

export interface ClassBehaviorCardProps {
  metrics: StudentBehaviorMetrics;
  onAttemptUnban?: () => void;
  className?: string;
}

export interface QuestionItemCardProps {
  question: StudentQuestionItem;
  className?: string;
}

export interface TeacherQuestionsCardProps {
  questions: StudentQuestionItem[];
  className?: string;
}

export interface AttendanceLogItemProps {
  record: AttendanceLogRecord;
  className?: string;
}

export interface AttendanceReportCardProps {
  attendanceLogs: AttendanceLogRecord[];
  studentName: string;
  onDownloadReport?: () => void;
  className?: string;
}

export interface ClassProgressSectionProps {
  studentName?: string;
  behaviorMetrics?: StudentBehaviorMetrics;
  questionsList?: StudentQuestionItem[];
  attendanceLogs?: AttendanceLogRecord[];
  className?: string;
}

export interface UseAttendanceReportOptions {
  attendanceLogs?: AttendanceLogRecord[];
  studentName?: string;
}

export interface UseClassProgressSectionOptions {
  studentName?: string;
  behaviorMetrics?: StudentBehaviorMetrics;
  questionsList?: StudentQuestionItem[];
  attendanceLogs?: AttendanceLogRecord[];
}
