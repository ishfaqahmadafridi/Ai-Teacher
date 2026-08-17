'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { NavBrandHeaderProps } from '../../types/topbar.types';

export const NavBrandHeader = memo(function NavBrandHeader({
  brandName = 'NEUROLEARN',
  className = '',
}: NavBrandHeaderProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-11 h-11 shrink-0">
        <Image
          src="/neurolearn-brain-logo.png"
          alt="NEUROLEARN Logo"
          fill
          sizes="44px"
          className="object-contain rounded-lg mix-blend-screen"
          style={{
            mixBlendMode: 'screen',
            filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.9))',
          }}
          priority
        />
      </div>
      <span className="font-extrabold tracking-[0.14em] uppercase text-white font-['Outfit',sans-serif] text-xl">
        {brandName}
      </span>
    </div>
  );
});

NavBrandHeader.displayName = 'NavBrandHeader';
