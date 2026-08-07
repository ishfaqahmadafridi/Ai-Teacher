'use client';

import { memo } from 'react';
import type { IconProps } from './GoogleIcon';

export const MicrosoftIcon = memo(function MicrosoftIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#F35325" d="M11.4 11.4H0V0h11.4z" />
      <path fill="#81BC06" d="M24 11.4H12.6V0H24z" />
      <path fill="#05A6F0" d="M11.4 24H0V12.6h11.4z" />
      <path fill="#FFBA08" d="M24 24H12.6V12.6H24z" />
    </svg>
  );
});

MicrosoftIcon.displayName = 'MicrosoftIcon';
