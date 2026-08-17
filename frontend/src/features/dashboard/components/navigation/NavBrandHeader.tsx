'use client';

import { memo } from 'react';
import { Brain } from 'lucide-react';
import type { NavBrandHeaderProps } from '../../types/topbar.types';

export const NavBrandHeader = memo(function NavBrandHeader({
  brandName = 'NEUROLEARN',
  className = '',
}: NavBrandHeaderProps) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1d4ed8] via-[#2563eb] to-[#38bdf8] text-white flex items-center justify-center shadow-lg shadow-[#2563eb]/30 shrink-0">
        <Brain className="w-5.5 h-5.5 text-white" aria-hidden="true" />
      </div>
      <span className="font-['Hanken_Grotesk',sans-serif] text-xl font-black text-white tracking-[0.12em] uppercase">
        {brandName}
      </span>
    </div>
  );
});

NavBrandHeader.displayName = 'NavBrandHeader';
