export interface CourseInfoBadgeProps {
  title?: string;
  chapter?: string;
  topic?: string;
  subjectTitle?: string;
  chapterText?: string;
  topicTitle?: string;
  className?: string;
}

export interface SessionProgressTimerProps {
  initialSeconds?: number;
  elapsedFormatted?: string;
  progressPercent?: number;
  currentChunkIndex?: number;
  totalChunks?: number;
  className?: string;
}

export interface HeaderActionGroupProps {
  onLogout?: () => void;
  onLeaveClass?: () => void;
  onOpenParticipants?: () => void;
  className?: string;
}

export interface TopBarProps {
  className?: string;
}
