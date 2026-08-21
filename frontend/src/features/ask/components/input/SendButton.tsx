'use client';

import { memo } from 'react';
import { Button } from '../ui';
import type { SendButtonProps } from '../../types/ask.types';

export const SendButton = memo(function SendButton({
  disabled,
  onClick,
  className = '',
}: SendButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 disabled:cursor-not-allowed text-white shrink-0 border-none cursor-pointer transition-all flex items-center justify-center ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z"/>
        <path d="M22 2 11 13"/>
      </svg>
    </Button>
  );
});

SendButton.displayName = 'SendButton';
