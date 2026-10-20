'use client';

import { memo } from 'react';
import { NEXT_GEN_BADGE_TEXT } from '../../constants/introConstants';

export const NextGenBadge = memo(function NextGenBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-dashboard-border bg-dashboard-panel text-dashboard-muted font-medium text-xs tracking-wide mb-7"
      style={{
        animation: 'intro-fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
      }}
    >
      <span className="w-2 h-2 rounded-full bg-dashboard-primary" />
      <span>{NEXT_GEN_BADGE_TEXT}</span>
    </div>
  );
});

NextGenBadge.displayName = 'NextGenBadge';
