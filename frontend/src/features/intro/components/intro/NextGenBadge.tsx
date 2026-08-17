'use client';

import { memo } from 'react';
import { NEXT_GEN_BADGE_TEXT } from '../../constants/introConstants';

export const NextGenBadge = memo(function NextGenBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-md text-cyan-300 font-semibold text-xs tracking-widest uppercase mb-8 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
      style={{
        animation: 'intro-fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
      }}
    >
      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
      <span>{NEXT_GEN_BADGE_TEXT}</span>
    </div>
  );
});

NextGenBadge.displayName = 'NextGenBadge';
