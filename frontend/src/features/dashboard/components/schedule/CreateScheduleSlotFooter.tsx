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
        className={`flex items-center justify-end gap-3 pt-4 border-t border-slate-800 ${className}`}
      >
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Class to Timetable</span>
        </button>
      </div>
    );
  }
);

CreateScheduleSlotFooter.displayName = 'CreateScheduleSlotFooter';
