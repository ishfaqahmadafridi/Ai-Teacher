'use client';

import { memo } from 'react';
import { Sparkles, Play, Upload } from 'lucide-react';
import type { AssignmentCardActionButtonsProps } from '../../types/assignments.types';

export const AssignmentCardActionButtons = memo(function AssignmentCardActionButtons({
  isQuiz,
  actionButtonText,
  actionBtnStyles,
  onActionClick,
  onAiHelpClick,
  hasAiHelp,
  className = '',
}: AssignmentCardActionButtonsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Ask AI Help Button */}
      {hasAiHelp && (
        <button
          type="button"
          onClick={onAiHelpClick}
          className="p-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-[#38BDF8] transition-all cursor-pointer"
          title="Ask AI Helper for Hints"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      )}

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={onActionClick}
        className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2 ${actionBtnStyles}`}
      >
        {isQuiz ? <Play className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
        <span>{actionButtonText}</span>
      </button>
    </div>
  );
});

AssignmentCardActionButtons.displayName = 'AssignmentCardActionButtons';
