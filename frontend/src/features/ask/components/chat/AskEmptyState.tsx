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
    <div className={`flex-1 flex flex-col items-center justify-center gap-5 w-full max-w-[36rem] mx-auto text-center px-4 my-auto ${className}`}>
      <div className="relative w-20 h-20 shrink-0 mb-2">
        <Image
          src="/neurolearn-brain-logo.png"
          alt="NEUROLEARN Brain Logo"
          fill
          sizes="80px"
          className="object-contain rounded-2xl"
          priority
        />
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-dashboard-text mb-2 font-['Hanken_Grotesk',sans-serif]">
          {title}
        </h2>
        <p className="text-base text-dashboard-muted leading-relaxed font-['Hanken_Grotesk',sans-serif]">
          {description}
        </p>
      </div>
    </div>
  );
});

AskEmptyState.displayName = 'AskEmptyState';
