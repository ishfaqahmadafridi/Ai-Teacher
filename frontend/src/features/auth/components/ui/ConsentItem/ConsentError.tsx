'use client';

import { memo } from 'react';
import type { ConsentErrorProps } from '../../../types/createAccount.types';

export const ConsentError = memo(function ConsentError({ id, message }: ConsentErrorProps) {
  return (
    <p
      id={id}
      role="alert"
      aria-live="polite"
      className="text-xs text-[#ff5252] pl-6 font-['Inter',sans-serif]"
    >
      {message}
    </p>
  );
});

ConsentError.displayName = 'ConsentError';
