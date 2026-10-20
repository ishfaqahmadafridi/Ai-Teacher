'use client';

import { memo } from 'react';
import type { AssignModalFooterActionsProps } from '../../types/assignments.types';

export const AssignModalFooterActions = memo(function AssignModalFooterActions({
  onClose,
  className = '',
}: AssignModalFooterActionsProps) {
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
        Publish & Assign Work
      </button>
    </div>
  );
});

AssignModalFooterActions.displayName = 'AssignModalFooterActions';
