'use client';

import { memo } from 'react';
import { getStudentSummaryVariantStyles } from '../../utilities/styleUtils';
import { StudentSummaryDot } from './StudentSummaryDot';
import type { StudentSummaryRowProps } from '../../types/sidebar.types';

export const StudentSummaryRow = memo(function StudentSummaryRow({
  label,
  count,
  variant,
  className = '',
}: StudentSummaryRowProps) {
  const { textColor } = getStudentSummaryVariantStyles(variant);

  return (
    <div
      className={`flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        {/* Dot / Icon Sub-component */}
        <StudentSummaryDot variant={variant} />

        <span className={`font-['Hanken_Grotesk',sans-serif] text-xs font-medium ${textColor}`}>
          {label}
        </span>
      </div>
      <span className={`text-xs font-bold font-mono ${textColor}`}>{count}</span>
    </div>
  );
});

StudentSummaryRow.displayName = 'StudentSummaryRow';
