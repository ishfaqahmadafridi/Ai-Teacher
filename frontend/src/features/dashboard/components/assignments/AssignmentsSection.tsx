'use client';

import { memo } from 'react';
import { useAssignmentsSection } from '../../hooks';
import { AssignmentsHeaderBanner } from './AssignmentsHeaderBanner';
import { AssignmentsGrid } from './AssignmentsGrid';
import { AssignmentsModalsContainer } from './AssignmentsModalsContainer';
import type { AssignmentsSectionProps } from '../../types/assignments.types';

export const AssignmentsSection = memo(function AssignmentsSection({
  autoOpenTask,
  className = '',
}: AssignmentsSectionProps) {
  const { headerProps, gridProps, modalProps } = useAssignmentsSection({ autoOpenTask });

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Top Banner & Control Filters */}
      <AssignmentsHeaderBanner {...headerProps} />

      {/* Assignments & Quizzes Grid / Empty State */}
      <AssignmentsGrid {...gridProps} />

      {/* Modals Container */}
      <AssignmentsModalsContainer {...modalProps} />
    </div>
  );
});

AssignmentsSection.displayName = 'AssignmentsSection';
