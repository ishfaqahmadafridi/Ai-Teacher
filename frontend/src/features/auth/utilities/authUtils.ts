import type { CSSProperties } from 'react';

/**
 * Pure helper utility function to compute light theme input field style.
 * No React hooks, no Redux, zero side-effects.
 */
export function getInputStyle(hasError?: boolean | string): CSSProperties {
  return {
    background: 'var(--color-dashboard-panel)',
    border: hasError ? '1.5px solid var(--color-dashboard-danger)' : '1px solid var(--color-dashboard-border)',
  };
}

/**
 * Formats full international mobile number from dial code and number input.
 */
export function formatFullMobile(dialCode: string, mobileNumber: string): string {
  const cleanMobile = mobileNumber.trim().replace(/^0+/, '');
  return `${dialCode}${cleanMobile}`;
}
