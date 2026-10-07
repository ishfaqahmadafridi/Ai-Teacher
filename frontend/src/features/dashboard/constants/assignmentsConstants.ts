import type { AssignmentQuizItem } from '../types/assignments.types';

export const DEFAULT_ASSIGNMENTS_QUIZZES: AssignmentQuizItem[] = [];

export function getAssignmentFilterTabs(totalCount: number, pendingCount: number) {
  return [
    { id: 'all', label: `All Work (${totalCount})` },
    { id: 'assignments', label: 'Assignments' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'pending', label: `To Do (${pendingCount})` },
    { id: 'submitted', label: 'Turned In' },
    { id: 'graded', label: 'Graded' },
  ];
}

export const ASSIGNMENT_SUBJECT_OPTIONS = [
  'Computer Science',
  'Advanced AI & Deep Learning',
  'Data Science & Analytics',
  'Computer Vision',
  'Mathematics & Physics',
];
