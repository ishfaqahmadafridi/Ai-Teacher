import type { CSSProperties } from 'react';

/**
 * Pure helper utility function to compute dark theme input field style.
 * No React hooks, no Redux, zero side-effects.
 */
export function getInputStyle(hasError?: boolean | string): CSSProperties {
  return {
    background: '#1a2235',
    border: hasError ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.18)',
  };
}

/**
 * Formats full international mobile number from dial code and number input.
 */
export function formatFullMobile(dialCode: string, mobileNumber: string): string {
  const cleanMobile = mobileNumber.trim().replace(/^0+/, '');
  return `${dialCode}${cleanMobile}`;
}
