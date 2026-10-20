'use client';

import { memo } from 'react';
import { Plus } from 'lucide-react';
import type { CreateScheduleSlotFooterProps } from '../../types/schedule.types';

export const CreateScheduleSlotFooter = memo(
  function CreateScheduleSlotFooter({
    onClose,
    className = '',
  }: CreateScheduleSlotFooterProps) {
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
          className="dashboard-button dashboard-button-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Add Class to Timetable</span>
        </button>
      </div>
    );
  }
);

CreateScheduleSlotFooter.displayName = 'CreateScheduleSlotFooter';
