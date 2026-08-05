'use client';

import type { AuthErrorProps } from '../../types';

export function AuthError({ message }: AuthErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="mb-4 px-4 py-3 rounded-xl text-sm border font-['Inter',sans-serif]"
      style={{
        background: 'rgba(255, 180, 171, 0.08)',
        borderColor: 'rgba(255, 180, 171, 0.25)',
        color: '#ffb4ab',
      }}
    >
      {message}
    </div>
  );
}

