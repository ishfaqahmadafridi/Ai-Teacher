'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { NavBrandHeaderProps } from '../../../types/topbar.types';

export const NavBrandHeader = memo(function NavBrandHeader({
  brandName = 'Neurolearn',
  className = '',
}: NavBrandHeaderProps) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <div className="relative w-10 h-10 shrink-0">
        <Image
          src="/neurolearn-brain-logo.png"
          alt=""
          fill
          sizes="40px"
          className="object-contain rounded-lg"
          priority
        />
      </div>
      <span className="font-['Outfit',sans-serif] text-xl font-semibold tracking-tight text-dashboard-text leading-tight">
        {brandName}
      </span>
    </div>
  );
});

NavBrandHeader.displayName = 'NavBrandHeader';
