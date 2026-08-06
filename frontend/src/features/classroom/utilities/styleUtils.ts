import React from 'react';

/**
 * Computes class names for sidebar topic item rows.
 */
export function getTopicItemRowStyles(
  isDisabled: boolean | undefined,
  isActive: boolean,
  customClassName: string = ''
): string {
  const baseStyles =
    'w-full text-left flex items-center gap-3 p-2 rounded-lg transition-all border border-transparent outline-none focus-visible:ring-1 focus-visible:ring-[#2e5bff]';
  const stateStyles = isDisabled
    ? 'opacity-40 cursor-not-allowed'
    : 'cursor-pointer group hover:bg-white/5';
  const activeStyles = isActive ? 'bg-white/5 !border-white/10' : '';

  return `${baseStyles} ${stateStyles} ${activeStyles} ${customClassName}`.trim();
}

export interface SummaryVariantStyles {
  textColor: string;
  variantType: 'total' | 'present' | 'absent';
}

/**
 * Resolves text color styling classes based on attendance summary variant.
 */
export function getStudentSummaryVariantStyles(
  variant: 'total' | 'present' | 'absent'
): SummaryVariantStyles {
  switch (variant) {
    case 'present':
      return { textColor: 'text-[#6ffbbe]', variantType: 'present' };
    case 'absent':
      return { textColor: 'text-[#ffb4ab]', variantType: 'absent' };
    case 'total':
    default:
      return { textColor: 'text-[#e2e2e8]', variantType: 'total' };
  }
}
