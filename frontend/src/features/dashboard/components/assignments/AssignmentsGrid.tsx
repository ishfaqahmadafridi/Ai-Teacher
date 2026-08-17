'use client';

import { memo } from 'react';
import { useAssignmentsGrid } from '../../hooks';
import { AssignmentsEmptyState } from './AssignmentsEmptyState';
import { AssignmentCard } from './AssignmentCard';
import type { AssignmentsGridProps } from '../../types/assignments.types';

export const AssignmentsGrid = memo(function AssignmentsGrid({
  filteredItems,
  searchQuery,
  onOpenSubmitModal,
  onOpenQuizPlayerModal,
  className = '',
}: AssignmentsGridProps) {
  const { isEmpty } = useAssignmentsGrid({ filteredItems });

  if (isEmpty) {
    return <AssignmentsEmptyState searchQuery={searchQuery} className={className} />;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {filteredItems.map((item) => (
        <AssignmentCard
          key={item.id}
          item={item}
          onOpenSubmitModal={onOpenSubmitModal}
          onOpenQuizPlayerModal={onOpenQuizPlayerModal}
        />
      ))}
    </div>
  );
});

AssignmentsGrid.displayName = 'AssignmentsGrid';
