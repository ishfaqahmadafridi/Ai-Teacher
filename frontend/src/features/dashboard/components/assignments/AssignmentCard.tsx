'use client';

import { memo } from 'react';
import { useAssignmentCard } from '../../hooks';
import { AssignmentCardBody } from './AssignmentCardBody';
import { AssignmentCardFooter } from './AssignmentCardFooter';
import type { AssignmentCardProps } from '../../types/assignments.types';

export const AssignmentCard = memo(function AssignmentCard({
  item,
  onOpenSubmitModal,
  onOpenQuizPlayerModal,
  onAskAiHelp,
  className = '',
}: AssignmentCardProps) {
  const {
    isQuiz,
    isSubmitted,
    isGraded,
    isUrgent,
    containerBgStyles,
    actionBtnStyles,
    actionButtonText,
    handleActionClick,
    handleAiHelpClick,
  } = useAssignmentCard({
    item,
    onOpenSubmitModal,
    onOpenQuizPlayerModal,
    onAskAiHelp,
  });

  return (
    <div
      className={`bg-[#0F172A] border rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-[#38BDF8]/40 flex flex-col justify-between gap-5 ${containerBgStyles} ${className}`}
    >
      {/* Body Section */}
      <AssignmentCardBody item={item} isGraded={isGraded} />

      {/* Footer Controls & Actions */}
      <AssignmentCardFooter
        item={item}
        isQuiz={isQuiz}
        isSubmitted={isSubmitted}
        isGraded={isGraded}
        isUrgent={isUrgent}
        actionBtnStyles={actionBtnStyles}
        actionButtonText={actionButtonText}
        onActionClick={handleActionClick}
        onAiHelpClick={handleAiHelpClick}
        hasAiHelp={Boolean(onAskAiHelp)}
      />
    </div>
  );
});

AssignmentCard.displayName = 'AssignmentCard';
