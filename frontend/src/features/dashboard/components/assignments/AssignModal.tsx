'use client';

import { memo } from 'react';
import { DashboardDialog } from '../modals/DashboardDialog';
import { useAssignModal } from '../../hooks';
import { AssignModalHeader } from './AssignModalHeader';
import { AssignModalTypeSelector } from './AssignModalTypeSelector';
import { AssignModalFormFields } from './AssignModalFormFields';
import { AssignModalFooterActions } from './AssignModalFooterActions';
import type { AssignModalProps } from '../../types/assignments.types';

export const AssignModal = memo(function AssignModal({
  isOpen,
  onClose,
  onAssignWork,
}: AssignModalProps) {
  const {
    title,
    type,
    subject,
    dueDate,
    points,
    instructions,
    handleTitleChange,
    handleTypeChange,
    handleSubjectChange,
    handleDueDateChange,
    handlePointsChange,
    handleInstructionsChange,
    handleSubmit,
  } = useAssignModal(onAssignWork, onClose);

  if (!isOpen) return null;

  return (
    <DashboardDialog title="Assign work" onClose={onClose} className="max-w-[42rem] p-5 sm:p-8 space-y-6">
        {/* Modal Header */}
        <AssignModalHeader onClose={onClose} />

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selector (Assignment vs Quiz) */}
          <AssignModalTypeSelector type={type} onTypeChange={handleTypeChange} />

          {/* Form Input Fields */}
          <AssignModalFormFields
            title={title}
            subject={subject}
            dueDate={dueDate}
            points={points}
            instructions={instructions}
            onTitleChange={handleTitleChange}
            onSubjectChange={handleSubjectChange}
            onDueDateChange={handleDueDateChange}
            onPointsChange={handlePointsChange}
            onInstructionsChange={handleInstructionsChange}
          />

          {/* Action Buttons */}
          <AssignModalFooterActions onClose={onClose} />
        </form>
    </DashboardDialog>
  );
});

AssignModal.displayName = 'AssignModal';
