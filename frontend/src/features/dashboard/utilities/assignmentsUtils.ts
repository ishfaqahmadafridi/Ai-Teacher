import type { AssignmentQuizItem } from '../types/assignments.types';

export function filterAssignments(
  items: AssignmentQuizItem[],
  query: string,
  filterTab: string
): AssignmentQuizItem[] {
  const sanitizedQuery = query.toLowerCase().trim();

  return items.filter((item) => {
    // 1. Filter by category tab
    if (filterTab === 'assignments' && item.type !== 'assignment') return false;
    if (filterTab === 'quizzes' && item.type !== 'quiz') return false;
    if (filterTab === 'pending' && item.status !== 'pending' && item.status !== 'urgent') return false;
    if (filterTab === 'submitted' && item.status !== 'submitted') return false;
    if (filterTab === 'graded' && item.status !== 'graded') return false;

    // 2. Filter by search query
    if (!sanitizedQuery) return true;

    return (
      item.title.toLowerCase().includes(sanitizedQuery) ||
      item.subject.toLowerCase().includes(sanitizedQuery) ||
      item.instructions.toLowerCase().includes(sanitizedQuery)
    );
  });
}

export function calculateGcrStats(items: AssignmentQuizItem[]) {
  const total = items.length;
  const pendingCount = items.filter((i) => i.status === 'pending' || i.status === 'urgent').length;
  const submittedCount = items.filter((i) => i.status === 'submitted').length;
  const gradedCount = items.filter((i) => i.status === 'graded').length;
  const urgentCount = items.filter((i) => i.isUrgent || i.status === 'urgent').length;

  return {
    total,
    pendingCount,
    submittedCount,
    gradedCount,
    urgentCount,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getAssignmentCardContainerStyles(isUrgent: boolean, isGraded: boolean): string {
  if (isUrgent) return 'border-dashboard-danger/50 bg-dashboard-danger/5';
  if (isGraded) return 'border-dashboard-success/40 bg-dashboard-success/5';
  return 'border-dashboard-border';
}

export function getAssignmentActionButtonStyles(
  isQuiz: boolean,
  isGraded: boolean,
  isSubmitted: boolean,
  isUrgent: boolean
): string {
  if (isQuiz) {
    return isGraded
      ? 'bg-dashboard-subtle text-dashboard-muted hover:text-dashboard-text'
      : 'bg-dashboard-primary hover:bg-dashboard-primary-hover text-white';
  }

  if (isSubmitted || isGraded) {
    return 'bg-dashboard-subtle text-dashboard-primary border border-dashboard-primary/30 hover:bg-dashboard-subtle';
  }

  if (isUrgent) {
    return 'bg-dashboard-danger hover:bg-dashboard-danger text-white';
  }

  return 'bg-dashboard-primary hover:bg-dashboard-primary-hover text-white';
}
