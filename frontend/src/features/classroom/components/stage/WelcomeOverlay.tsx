'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { WelcomeOverlayProps } from './stage.types';

export const WelcomeOverlay = memo(function WelcomeOverlay({
  isVisible,
  className = '',
}: WelcomeOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none z-30 bg-[#0A0C10]/50 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 md:w-16 md:h-16 shrink-0">
          <Image
            src="/neurolearn-brain-logo.png"
            alt="NEUROLEARN Logo"
            fill
            sizes="64px"
            className="object-contain mix-blend-screen"
            style={{
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.9))',
            }}
            priority
          />
        </div>
        <span className="font-extrabold tracking-[0.14em] uppercase text-white text-2xl md:text-3xl font-['Hanken_Grotesk',sans-serif]">
          NEUROLEARN
        </span>
      </div>
      <h2 className="text-base md:text-lg font-semibold text-[#c4c5d9]">
        Welcome to NeuroLearn AI Live Classroom
      </h2>
    </div>
  );
});

WelcomeOverlay.displayName = 'WelcomeOverlay';
