'use client';

import { memo } from 'react';
import { PlusCircle, X } from 'lucide-react';
import type { CreateScheduleSlotHeaderProps } from '../../types/schedule.types';

export const CreateScheduleSlotHeader = memo(
  function CreateScheduleSlotHeader({
    onClose,
    className = '',
  }: CreateScheduleSlotHeaderProps) {
    return (
      <div
        className={`flex items-start justify-between border-b border-dashboard-border pb-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-dashboard-selected border border-dashboard-border text-dashboard-primary">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-dashboard-text">
              Add Timetable Class Slot
            </h3>
            <p className="text-xs text-dashboard-muted">
              Manually schedule a new lecture session, lab, or study slot
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-subtle transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }
);

CreateScheduleSlotHeader.displayName = 'CreateScheduleSlotHeader';
