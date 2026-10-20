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
      className={`min-h-11 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashboard-primary transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm ${
        active
          ? 'bg-amber-500/25 text-dashboard-warning border border-amber-500/60 shadow-amber-500/10'
          : 'bg-dashboard-subtle hover:bg-dashboard-selected text-dashboard-text border border-dashboard-border hover:text-dashboard-primary'
      } ${className}`}
      aria-pressed={active}
      title={active ? 'Lower Hand' : 'Raise Hand'}
    >
      <Hand className={`w-4 h-4 ${active ? 'text-dashboard-warning fill-dashboard-warning' : 'text-dashboard-muted'}`} />
      <span>{active ? 'Lower Hand' : 'Raise Hand'}</span>
    </button>
  );
});

RaiseHandButton.displayName = 'RaiseHandButton';
