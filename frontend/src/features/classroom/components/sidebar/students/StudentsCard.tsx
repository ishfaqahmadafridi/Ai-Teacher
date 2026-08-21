'use client';

import { memo } from 'react';
import { useStudentsCard } from '../../../hooks/useStudentsCard';
import { StudentsCardHeader } from './StudentsCardHeader';
import { StudentSummaryRow } from './StudentSummaryRow';
import type { StudentsCardProps } from '../../../types/sidebar.types';

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
    <div className="space-y-3">
      <StudentsCardHeader
        presentCount={present}
        totalCount={total}
        isExpanded={isExpanded}
        onToggle={toggleExpand}
      />

      {isExpanded && (
        <div className="space-y-2 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <StudentSummaryRow label="Total Enrolled" count={total} variant="total" />
          <StudentSummaryRow label="Present in Session" count={present} variant="present" />
          <StudentSummaryRow label="Absent / Offline" count={absent} variant="absent" />
        </div>
      )}
    </div>
  );
});

StudentsCard.displayName = 'StudentsCard';
