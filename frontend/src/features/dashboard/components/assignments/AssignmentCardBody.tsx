'use client';

import { memo } from 'react';
import { AssignmentCardHeader } from './AssignmentCardHeader';
import { AssignmentCardAttachments } from './AssignmentCardAttachments';
import { AssignmentCardGradeBanner } from './AssignmentCardGradeBanner';
import type { AssignmentCardBodyProps } from '../../types/assignments.types';

export const AssignmentCardBody = memo(function AssignmentCardBody({
  item,
  isGraded,
  className = '',
}: AssignmentCardBodyProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Badges Row */}
      <AssignmentCardHeader type={item.type} subject={item.subject} points={item.points} />

      {/* Title */}
      <h4 className="font-['Hanken_Grotesk',sans-serif] text-lg font-bold text-white leading-snug">
        {item.title}
      </h4>

      {/* Instructions */}
      <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
        {item.instructions}
      </p>

      {/* Attachments List */}
      {item.attachments && (
        <AssignmentCardAttachments attachments={item.attachments} />
      )}

      {/* Submission Grade Feedback Banner */}
      {isGraded && item.submission?.grade && (
        <AssignmentCardGradeBanner grade={item.submission.grade} />
      )}
    </div>
  );
});

AssignmentCardBody.displayName = 'AssignmentCardBody';
