'use client';

import { memo } from 'react';
import type { SubmitAssignmentFooterActionsProps } from '../../types/assignments.types';

export const SubmitAssignmentFooterActions = memo(function SubmitAssignmentFooterActions({
  onClose,
  className = '',
}: SubmitAssignmentFooterActionsProps) {
  return (
    <div className={`flex items-center justify-end gap-3 pt-4 border-t border-dashboard-border ${className}`}>
      <button
        type="button"
        onClick={onClose}
        className="dashboard-button dashboard-button-secondary"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="dashboard-button dashboard-button-primary"
      >
        Turn In Assignment
      </button>
    </div>
  );
});

SubmitAssignmentFooterActions.displayName = 'SubmitAssignmentFooterActions';
