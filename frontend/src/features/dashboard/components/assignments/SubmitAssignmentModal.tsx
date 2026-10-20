'use client';

import { memo } from 'react';
import { DashboardDialog } from '../modals/DashboardDialog';
import { useSubmitAssignmentModal } from '../../hooks';
import { SubmitAssignmentHeader } from './SubmitAssignmentHeader';
import { SubmitAssignmentDetailsView } from './SubmitAssignmentDetailsView';
import { SubmitAssignmentDropzone } from './SubmitAssignmentDropzone';
import { SubmitAssignmentFilesList } from './SubmitAssignmentFilesList';
import { SubmitAssignmentTextNoteInput } from './SubmitAssignmentTextNoteInput';
import { SubmitAssignmentFooterActions } from './SubmitAssignmentFooterActions';
import type { SubmitAssignmentModalProps } from '../../types/assignments.types';

export const SubmitAssignmentModal = memo(function SubmitAssignmentModal({
  isOpen,
  onClose,
  item,
  onSubmitWork,
}: SubmitAssignmentModalProps) {
  const {
    isAlreadySubmitted,
    headerProps,
    dropzoneProps,
    filesListProps,
    textNoteProps,
    handleSubmit,
  } = useSubmitAssignmentModal(item, onSubmitWork, onClose);

  if (!isOpen || !item) return null;

  return (
    <DashboardDialog title="Assignment submission" onClose={onClose} className="max-w-[42rem] p-5 sm:p-8 space-y-6">
        {/* Modal Header */}
        <SubmitAssignmentHeader {...headerProps} />

        {/* Existing Submission Details if already turned in */}
        {isAlreadySubmitted && item.submission && (
          <SubmitAssignmentDetailsView submission={item.submission} />
        )}

        {/* Submission Form */}
        {!isAlreadySubmitted && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Drag and Drop File Upload Area */}
            <SubmitAssignmentDropzone {...dropzoneProps} />

            {/* Uploaded Files List */}
            <SubmitAssignmentFilesList {...filesListProps} />

            {/* Optional Text Note */}
            <SubmitAssignmentTextNoteInput {...textNoteProps} />

            {/* Modal Actions */}
            <SubmitAssignmentFooterActions onClose={onClose} />
          </form>
        )}
    </DashboardDialog>
  );
});

SubmitAssignmentModal.displayName = 'SubmitAssignmentModal';
