'use client';

import { memo } from 'react';
import Image from 'next/image';
import { DEFAULT_EMPTY_STATE } from '../../constants/askConstants';
import type { AskEmptyStateProps } from '../../types/ask.types';

export const AskEmptyState = memo(function AskEmptyState({
  title = DEFAULT_EMPTY_STATE.title,
  description = DEFAULT_EMPTY_STATE.description,
  className = '',
}: AskEmptyStateProps) {
  return (
    <div className={`flex-1 flex flex-col items-center justify-center gap-6 max-w-md mx-auto text-center px-4 my-auto ${className}`}>
      <div className="relative w-20 h-20 shrink-0 mb-2">
        <Image
          src="/neurolearn-brain-logo.png"
          alt="NEUROLEARN Brain Logo"
          fill
          sizes="80px"
          className="object-contain rounded-2xl mix-blend-screen"
          style={{
            mixBlendMode: 'screen',
            filter: 'drop-shadow(0 0 20px rgba(56,189,248,0.9))',
          }}
          priority
        />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-2 font-['Outfit',sans-serif]">
          {title}
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed font-['Hanken_Grotesk',sans-serif]">
          {description}
        </p>
      </div>
    </div>
  );
});

AskEmptyState.displayName = 'AskEmptyState';
