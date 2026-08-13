'use client';

import { memo } from 'react';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import type { AssignmentCardStatusProps } from '../../types/assignments.types';

export const AssignmentCardStatus = memo(function AssignmentCardStatus({
  dueDateFormatted,
  isUrgent,
  isSubmitted,
  isGraded,
  submittedAt,
  className = '',
}: AssignmentCardStatusProps) {
  return (
    <div className={`flex items-center gap-2 text-xs ${className}`}>
      {isUrgent ? (
        <span className="text-[#EF4444] font-bold flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>{dueDateFormatted}</span>
        </span>
      ) : isSubmitted ? (
        <span className="text-[#38BDF8] font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
          <span>Turned In ({submittedAt})</span>
        </span>
      ) : isGraded ? (
        <span className="text-[#10B981] font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>Completed & Graded</span>
        </span>
      ) : (
        <span className="text-[#94A3B8] font-medium flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#F59E0B]" />
          <span>{dueDateFormatted}</span>
        </span>
      )}
    </div>
  );
});

AssignmentCardStatus.displayName = 'AssignmentCardStatus';
