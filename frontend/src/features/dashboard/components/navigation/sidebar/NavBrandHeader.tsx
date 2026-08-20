'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { NavBrandHeaderProps } from '../../../types/topbar.types';

export const NavBrandHeader = memo(function NavBrandHeader({
  brandName = 'NEUROLEARN',
  className = '',
}: NavBrandHeaderProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-11 h-11 shrink-0">
        <Image
          src="/neurolearn-brain-logo.png"
          alt="NeuroLearn Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="min-w-0">
        <span className="text-base font-extrabold tracking-wider text-white block leading-tight">
          {brandName}
        </span>
        <span className="text-[10px] text-[#8B5CF6] font-semibold tracking-widest uppercase block">
          AI Physics Tutor
        </span>
      </div>
    </div>
  );
});

NavBrandHeader.displayName = 'NavBrandHeader';
