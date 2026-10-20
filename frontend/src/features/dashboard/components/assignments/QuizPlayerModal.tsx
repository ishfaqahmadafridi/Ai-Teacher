'use client';

import { memo } from 'react';
import { DashboardDialog } from '../modals/DashboardDialog';
import { useQuizPlayer } from '../../hooks';
import { QuizPlayerHeader } from './QuizPlayerHeader';
import { QuizPlayerResultView } from './QuizPlayerResultView';
import { QuizQuestionStep } from './QuizQuestionStep';
import { QuizPlayerFooter } from './QuizPlayerFooter';
import type { QuizPlayerModalProps } from '../../types/assignments.types';

export const QuizPlayerModal = memo(function QuizPlayerModal({
  isOpen,
  onClose,
  item,
  onCompleteQuiz,
}: QuizPlayerModalProps) {
  const { isSubmitted, headerProps, resultViewProps, questionStepProps, footerProps } =
    useQuizPlayer(item, onCompleteQuiz, onClose);

  if (!isOpen || !item) return null;

  return (
    <DashboardDialog title="Quiz" onClose={onClose} className="max-w-[42rem] p-5 sm:p-8 space-y-6">
        {/* Modal Header */}
        <QuizPlayerHeader {...headerProps} />

        {/* Quiz Body: Result View vs Question Stepper Player */}
        {isSubmitted ? (
          <QuizPlayerResultView {...resultViewProps} />
        ) : (
          <div className="space-y-6">
            <QuizQuestionStep {...questionStepProps} />
            <QuizPlayerFooter {...footerProps} />
          </div>
        )}
    </DashboardDialog>
  );
});

QuizPlayerModal.displayName = 'QuizPlayerModal';
