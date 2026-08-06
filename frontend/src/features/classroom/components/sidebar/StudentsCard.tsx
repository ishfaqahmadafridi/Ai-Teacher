'use client';

import { memo } from 'react';
import { useStudentsCard } from '../../hooks/useStudentsCard';
import { StudentsCardHeader } from './StudentsCardHeader';
import { StudentSummaryRow } from './StudentSummaryRow';
import type { StudentsCardProps } from '../../types/sidebar.types';

export const StudentsCard = memo(function StudentsCard({
  presentCount,
  totalCount,
  absentCount,
}: StudentsCardProps) {
  const { isExpanded, total, present, absent, toggleExpand } = useStudentsCard({
    presentCount,
    totalCount,
    absentCount,
  });

  return (
    <div className="bg-[#2e5bff]/10 border border-[#2e5bff]/20 rounded-xl overflow-hidden shadow-sm">
      {/* Collapsible Header Sub-component */}
      <StudentsCardHeader
        presentCount={present}
        totalCount={total}
        isExpanded={isExpanded}
        onToggle={toggleExpand}
      />

      {/* Students Summary Items List */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-2 space-y-2">
          <StudentSummaryRow label="Total Students" count={total} variant="total" />
          <StudentSummaryRow label="Present Students" count={present} variant="present" />
          <StudentSummaryRow label="Absent Students" count={absent} variant="absent" />
        </div>
      )}
    </div>
  );
});

StudentsCard.displayName = 'StudentsCard';
