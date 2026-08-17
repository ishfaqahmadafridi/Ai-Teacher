'use client';

import { memo } from 'react';
import type { SubmitAssignmentFooterActionsProps } from '../../types/assignments.types';

export const SubmitAssignmentFooterActions = memo(function SubmitAssignmentFooterActions({
  onClose,
  className = '',
}: SubmitAssignmentFooterActionsProps) {
  return (
    <div className={`flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B] ${className}`}>
      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2.5 rounded-xl bg-[#1E293B] text-[#94A3B8] hover:text-white font-bold text-xs cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-lg shadow-[#2563EB]/25 cursor-pointer"
      >
        Turn In Assignment
      </button>
    </div>
  );
});

SubmitAssignmentFooterActions.displayName = 'SubmitAssignmentFooterActions';
