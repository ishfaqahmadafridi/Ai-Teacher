'use client';

import { memo } from 'react';
import { AssignModal } from './AssignModal';
import { SubmitAssignmentModal } from './SubmitAssignmentModal';
import { QuizPlayerModal } from './QuizPlayerModal';
import type { AssignmentsModalsContainerProps } from '../../types/assignments.types';

export const AssignmentsModalsContainer = memo(function AssignmentsModalsContainer({
  isAssignModalOpen,
  isSubmitModalOpen,
  isQuizModalOpen,
  selectedItem,
  onCloseAssignModal,
  onCloseSubmitModal,
  onCloseQuizPlayerModal,
  onAssignNewWork,
  onSubmitWork,
  onCompleteQuiz,
}: AssignmentsModalsContainerProps) {
  return (
    <>
      {/* Assign New Work Modal */}
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={onCloseAssignModal}
        onAssignWork={onAssignNewWork}
      />

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
