'use client';

import { memo } from 'react';
import { Button } from '../ui/Button/Button';
import type { ResendTimerProps } from '../../types/verify.types';

export const ResendTimer = memo(function ResendTimer({ timer, onResend, isLoading = false }: ResendTimerProps) {
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[#c6c6cc]/60 text-sm">Didn&apos;t receive a code?</span>
      {timer > 0 ? (
        <span className="text-[#b8c3ff] font-semibold text-sm">
          Resend code in {formatTimer(timer)}
        </span>
      ) : (
        <Button
          type="button"
          onClick={onResend}
          disabled={isLoading}
          className="text-[#b8c3ff] font-semibold hover:underline bg-transparent border-none p-0 h-auto shadow-none cursor-pointer"
        >
          {isLoading ? 'Resending...' : 'Resend code now'}
        </Button>
      )}
    </div>
  );
});

ResendTimer.displayName = 'ResendTimer';
