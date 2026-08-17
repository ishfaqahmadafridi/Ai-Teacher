'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { LoginLogoProps } from '../../types';

export const LoginLogo = memo(function LoginLogo({ className = '' }: LoginLogoProps) {
  return (
    <div className={`flex justify-center items-center gap-3.5 mb-6 select-none ${className}`}>
      <div className="relative w-12 h-12 shrink-0">
        <Image
          src="/neurolearn-brain-logo.png"
          alt="NEUROLEARN Logo"
          fill
          sizes="48px"
          className="object-contain rounded-lg mix-blend-screen"
          style={{
            mixBlendMode: 'screen',
            filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.9))',
          }}
          priority
        />
      </div>
      <span className="font-extrabold tracking-[0.14em] uppercase text-white font-['Outfit',sans-serif] text-2xl">
        NEUROLEARN
      </span>
    </div>
  );
});

LoginLogo.displayName = 'LoginLogo';
