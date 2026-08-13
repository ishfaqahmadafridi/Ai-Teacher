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
  if (isUrgent) return 'border-[#EF4444]/50 bg-[#160D12]';
  if (isGraded) return 'border-[#10B981]/40 bg-[#091512]';
  return 'border-[#1E293B]';
}

export function getAssignmentActionButtonStyles(
  isQuiz: boolean,
  isGraded: boolean,
  isSubmitted: boolean,
  isUrgent: boolean
): string {
  if (isQuiz) {
    return isGraded
      ? 'bg-[#1E293B] text-[#94A3B8] hover:text-white'
      : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[#8B5CF6]/25';
  }

  if (isSubmitted || isGraded) {
    return 'bg-[#1E293B] text-[#38BDF8] border border-[#38BDF8]/30 hover:bg-[#334155]';
  }

  if (isUrgent) {
    return 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-[#DC2626]/25';
  }

  return 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-[#2563EB]/25';
}
