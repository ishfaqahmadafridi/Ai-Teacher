'use client';

import { memo } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
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
      </div>
    </div>
  );
});

SubmitAssignmentModal.displayName = 'SubmitAssignmentModal';
