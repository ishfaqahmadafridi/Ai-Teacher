'use client';

import { memo } from 'react';
import { SubmitAssignmentModal } from './SubmitAssignmentModal';
import { QuizPlayerModal } from './QuizPlayerModal';
import type { AssignmentsModalsContainerProps } from '../../types/assignments.types';

export const AssignmentsModalsContainer = memo(function AssignmentsModalsContainer({
  isSubmitModalOpen,
  isQuizModalOpen,
  selectedItem,
  onCloseSubmitModal,
  onCloseQuizPlayerModal,
  onSubmitWork,
  onCompleteQuiz,
}: AssignmentsModalsContainerProps) {
  return (
    <>
      {/* Submit Assignment File Upload Modal */}
      <SubmitAssignmentModal
        isOpen={isSubmitModalOpen}
        onClose={onCloseSubmitModal}
        item={selectedItem}
        onSubmitWork={onSubmitWork}
      />

      {/* Interactive Quiz Player Modal */}
      <QuizPlayerModal
        isOpen={isQuizModalOpen}
        onClose={onCloseQuizPlayerModal}
        item={selectedItem}
        onCompleteQuiz={onCompleteQuiz}
      />
    </>
  );
});

AssignmentsModalsContainer.displayName = 'AssignmentsModalsContainer';
