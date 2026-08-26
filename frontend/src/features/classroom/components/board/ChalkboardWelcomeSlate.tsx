'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { ChalkboardWelcomeSlateProps } from '../../types/board.types';

export const ChalkboardWelcomeSlate = memo(function ChalkboardWelcomeSlate({
  className = '',
}: ChalkboardWelcomeSlateProps) {
  return (
    <div
      className={`relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
    >
      {/* 1. Prominent Official Project Main Logo */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center p-3 mb-5 shadow-2xl shadow-emerald-500/25">
        <Image
          src="/neurolearn-brain-logo.png"
          alt="NEUROLEARN Project Logo"
          fill
          sizes="128px"
          className="object-contain p-1 rounded-2xl"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.95))',
          }}
          priority
        />
      </div>

      {/* 2. Welcome Back Heading */}
      <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-white/95 tracking-wide drop-shadow-[0_0_14px_rgba(255,255,255,0.4)] mb-1.5">
        Welcome Back!
      </h2>

      {/* 3. Class Name Subheading */}
      <p className="text-sm sm:text-base font-mono text-emerald-400/90 tracking-wider uppercase font-bold">
        Physics Mechanics Class
      </p>
    </div>
  );
});

ChalkboardWelcomeSlate.displayName = 'ChalkboardWelcomeSlate';
