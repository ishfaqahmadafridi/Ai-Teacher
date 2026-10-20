'use client';

import { memo } from 'react';
import { PlusCircle } from 'lucide-react';
import type { RegisterCourseFooterActionsProps } from '../../types/courses.types';

export const RegisterCourseFooterActions = memo(function RegisterCourseFooterActions({
  isPending,
  onClose,
  className = '',
}: RegisterCourseFooterActionsProps) {
  return (
    <div className={`pt-4 border-t border-dashboard-border flex items-center justify-end gap-3 mt-6 ${className}`}>
      <button
        type="button"
        onClick={onClose}
        className="dashboard-button dashboard-button-secondary"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="dashboard-button dashboard-button-primary"
      >
        <PlusCircle className="w-4 h-4" aria-hidden="true" />
        <span>Register Course Now</span>
      </button>
    </div>
  );
});

RegisterCourseFooterActions.displayName = 'RegisterCourseFooterActions';
