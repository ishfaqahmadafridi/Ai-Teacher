'use client';

import { Brain } from 'lucide-react';
import type { LoginLogoProps } from '../../types';

export function LoginLogo({ className = '' }: LoginLogoProps) {
  return (
    <div className={`flex justify-center items-center gap-3.5 mb-6 select-none ${className}`}>
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1d4ed8] via-[#2563eb] to-[#38bdf8] text-white flex items-center justify-center shadow-lg shadow-[#2563eb]/40 shrink-0">
        <Brain className="w-6 h-6 text-white" aria-hidden="true" />
      </div>
      <span className="font-['Hanken_Grotesk',sans-serif] text-2xl font-black text-white tracking-[0.14em] uppercase">
        NEUROLEARN
      </span>
    </div>
  );
}
