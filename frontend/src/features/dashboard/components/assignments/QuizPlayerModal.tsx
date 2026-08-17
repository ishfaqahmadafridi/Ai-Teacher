'use client';

import { memo } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0F172A] border border-[#8B5CF6]/40 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
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
      </div>
    </div>
  );
});

QuizPlayerModal.displayName = 'QuizPlayerModal';
