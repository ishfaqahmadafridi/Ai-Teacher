'use client';

import { memo } from 'react';
import { getStudentSummaryVariantStyles } from '../../../utilities/styleUtils';
import { StudentSummaryDot } from './StudentSummaryDot';
import type { StudentSummaryRowProps } from '../../../types/sidebar.types';

export const StudentSummaryRow = memo(function StudentSummaryRow({
  label,
  count,
  variant,
  className = '',
}: StudentSummaryRowProps) {
  const { textColor } = getStudentSummaryVariantStyles(variant);

  return (
    <div className={`flex items-center justify-between text-xs ${className}`}>
      <div className="flex items-center gap-2">
        <StudentSummaryDot variant={variant} />
        <span className="font-['Hanken_Grotesk',sans-serif] text-[#c4c5d9]">
          {label}
        </span>
      </div>
      <span className={`font-['Hanken_Grotesk',sans-serif] font-bold ${textColor}`}>
        {count}
      </span>
    </div>
  );
});

StudentSummaryRow.displayName = 'StudentSummaryRow';
