'use client';

import { memo } from 'react';
import { Hand } from 'lucide-react';
import type { RaiseHandButtonProps } from '../../types/input.types';

export const RaiseHandButton = memo(function RaiseHandButton({
  isHandRaised = false,
  onToggleRaiseHand,
  className = '',
}: RaiseHandButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggleRaiseHand}
      aria-label={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
      aria-pressed={isHandRaised}
      className={`flex flex-col items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full transition-all duration-200 cursor-pointer group shrink-0 ${
        isHandRaised
          ? 'bg-[#2e5bff] text-white shadow-[0_0_12px_rgba(46,91,255,0.6)]'
          : 'hover:bg-white/10 text-[#e2e2e8]'
      } ${className}`}
    >
      <Hand
        className={`w-4 h-4 md:w-4.5 md:h-4.5 mb-0.5 group-hover:scale-110 transition-transform ${
          isHandRaised ? 'animate-bounce' : ''
        }`}
        aria-hidden="true"
      />
      <span className="text-[8px] uppercase tracking-wider font-semibold opacity-75 leading-none">
        {isHandRaised ? 'Raised' : 'Raise'}
      </span>
    </button>
  );
});

RaiseHandButton.displayName = 'RaiseHandButton';
