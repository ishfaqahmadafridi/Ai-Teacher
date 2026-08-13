'use client';

import { memo } from 'react';
import type { AssignmentsEmptyStateProps } from '../../types/assignments.types';

export const AssignmentsEmptyState = memo(function AssignmentsEmptyState({
  searchQuery,
  className = '',
}: AssignmentsEmptyStateProps) {
  return (
    <div
      className={`bg-[#0F172A] border border-[#1E293B] rounded-3xl p-12 text-center space-y-3 ${className}`}
    >
      <div className="text-[#94A3B8] font-bold text-base">
        No assignments or quizzes found matching &ldquo;{searchQuery}&rdquo;.
      </div>
      <p className="text-xs text-[#64748B]">
        Try resetting your search query or selecting a different filter tab.
      </p>
    </div>
  );
});

AssignmentsEmptyState.displayName = 'AssignmentsEmptyState';
