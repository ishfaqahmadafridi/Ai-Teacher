'use client';

import { memo } from 'react';
import { Hand } from 'lucide-react';
import type { RaiseHandButtonProps } from '../../../types/input.types';

export const RaiseHandButton = memo(function RaiseHandButton({
  handRaised,
  isHandRaised,
  onToggleHand,
  onToggleRaiseHand,
  className = '',
}: RaiseHandButtonProps) {
  const active = handRaised ?? isHandRaised ?? false;
  const toggle = onToggleHand ?? onToggleRaiseHand;

  return (
    <button
      type="button"
      onClick={toggle}
      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm ${
        active
          ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60 shadow-amber-500/10'
          : 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:text-white'
      } ${className}`}
      title={active ? 'Lower Hand' : 'Raise Hand'}
    >
      <Hand className={`w-4 h-4 ${active ? 'text-amber-300 fill-amber-300' : 'text-amber-400'}`} />
      <span>{active ? 'Lower Hand' : 'Raise Hand'}</span>
    </button>
  );
});

RaiseHandButton.displayName = 'RaiseHandButton';
