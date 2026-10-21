'use client';

import { memo } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { TimetablePreferencesModalFooterProps } from '../../types/schedule.types';

export const TimetablePreferencesModalFooter = memo(
  function TimetablePreferencesModalFooter({
    onClose,
    isLoading = false,
    className = '',
  }: TimetablePreferencesModalFooterProps) {
    return (
      <div
        className={`flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-dashboard-border ${className}`}
      >
        <button
          type="button"
          onClick={onClose}
          className="dashboard-button dashboard-button-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="dashboard-button dashboard-button-primary"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Planning Schedule...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Create class timetable</span>
            </>
          )}
        </button>
      </div>
    );
  }
);

TimetablePreferencesModalFooter.displayName = 'TimetablePreferencesModalFooter';
