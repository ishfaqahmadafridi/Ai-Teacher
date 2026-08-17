'use client';

import { memo } from 'react';
import { AssignTaskTitleInput } from './AssignTaskTitleInput';
import { AssignSubjectPointsInput } from './AssignSubjectPointsInput';
import { AssignDueDateInstructionsInput } from './AssignDueDateInstructionsInput';
import type { AssignModalFormFieldsProps } from '../../types/assignments.types';

export const AssignModalFormFields = memo(function AssignModalFormFields({
  title,
  subject,
  dueDate,
  points,
  instructions,
  onTitleChange,
  onSubjectChange,
  onDueDateChange,
  onPointsChange,
  onInstructionsChange,
  className = '',
}: AssignModalFormFieldsProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Task Title */}
      <AssignTaskTitleInput title={title} onTitleChange={onTitleChange} />

      {/* Subject & Points Grid */}
      <AssignSubjectPointsInput
        subject={subject}
        points={points}
        onSubjectChange={onSubjectChange}
        onPointsChange={onPointsChange}
      />

      {/* Due Date & Task Instructions */}
      <AssignDueDateInstructionsInput
        dueDate={dueDate}
        instructions={instructions}
        onDueDateChange={onDueDateChange}
        onInstructionsChange={onInstructionsChange}
      />
    </div>
  );
});

AssignModalFormFields.displayName = 'AssignModalFormFields';
