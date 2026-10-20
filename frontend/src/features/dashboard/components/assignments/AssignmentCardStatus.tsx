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
        <span className="text-dashboard-danger font-bold flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>{dueDateFormatted}</span>
        </span>
      ) : isSubmitted ? (
        <span className="text-dashboard-primary font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-dashboard-primary" />
          <span>Turned In ({submittedAt})</span>
        </span>
      ) : isGraded ? (
        <span className="text-dashboard-success font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-dashboard-success" />
          <span>Completed & Graded</span>
        </span>
      ) : (
        <span className="text-dashboard-muted font-medium flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-dashboard-warning" />
          <span>{dueDateFormatted}</span>
        </span>
      )}
    </div>
  );
});

AssignmentCardStatus.displayName = 'AssignmentCardStatus';
