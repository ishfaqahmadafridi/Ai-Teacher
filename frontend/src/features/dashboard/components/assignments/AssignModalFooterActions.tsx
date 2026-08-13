'use client';

import { memo } from 'react';
import type { AssignModalFooterActionsProps } from '../../types/assignments.types';

export const AssignModalFooterActions = memo(function AssignModalFooterActions({
  onClose,
  className = '',
}: AssignModalFooterActionsProps) {
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
        className="px-6 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs shadow-lg shadow-[#8B5CF6]/25 cursor-pointer"
      >
        Publish & Assign Work
      </button>
    </div>
  );
});

AssignModalFooterActions.displayName = 'AssignModalFooterActions';
