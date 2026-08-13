'use client';

import { memo } from 'react';
import { AssignmentCardStatus } from './AssignmentCardStatus';
import { AssignmentCardActionButtons } from './AssignmentCardActionButtons';
import type { AssignmentCardFooterProps } from '../../types/assignments.types';

export const AssignmentCardFooter = memo(function AssignmentCardFooter({
  item,
  isQuiz,
  isSubmitted,
  isGraded,
  isUrgent,
  actionBtnStyles,
  actionButtonText,
  onActionClick,
  onAiHelpClick,
  hasAiHelp,
}: AssignmentCardFooterProps) {
  return (
    <div className="pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Due Date / Turn In Status */}
      <AssignmentCardStatus
        dueDateFormatted={item.dueDateFormatted}
        isUrgent={isUrgent}
        isSubmitted={isSubmitted}
        isGraded={isGraded}
        submittedAt={item.submission?.submittedAt}
      />

      {/* Action Buttons */}
      <AssignmentCardActionButtons
        isQuiz={isQuiz}
        actionButtonText={actionButtonText}
        actionBtnStyles={actionBtnStyles}
        onActionClick={onActionClick}
        onAiHelpClick={onAiHelpClick}
        hasAiHelp={hasAiHelp}
      />
    </div>
  );
});

AssignmentCardFooter.displayName = 'AssignmentCardFooter';
