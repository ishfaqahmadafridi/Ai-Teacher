'use client';

import { memo } from 'react';
import { ArrowUp } from 'lucide-react';
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
      aria-label="Send message"
      onClick={onClick}
      disabled={disabled}
      className={`size-10 p-0 rounded-full bg-dashboard-primary hover:bg-dashboard-primary-hover disabled:opacity-40 disabled:hover:bg-dashboard-primary disabled:cursor-not-allowed text-white shrink-0 border-none cursor-pointer transition-all flex items-center justify-center ${className}`}
    >
      <ArrowUp aria-hidden="true" className="size-5" strokeWidth={1.75} />
    </Button>
  );
});

SendButton.displayName = 'SendButton';
