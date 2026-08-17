'use client';

import { memo } from 'react';
import { STATS_DATA } from '../../constants/introConstants';

export const StatsStrip = memo(function StatsStrip() {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-14 max-w-4xl mx-auto w-full px-4"
      style={{
        animation: 'intro-fadeInUp 1.0s cubic-bezier(0.16, 1, 0.3, 1) 1.2s both',
      }}
    >
      {STATS_DATA.map((stat) => (
        <div
          key={stat.id}
          className="text-center p-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md hover:border-cyan-400/30 transition-all duration-300 group"
        >
          <div
            className="text-cyan-300 font-bold leading-none group-hover:scale-105 transition-transform duration-300"
            style={{ fontSize: 'clamp(24px, 3.2vw, 36px)' }}
          >
            {stat.value}
          </div>
          <div className="font-sans text-[11px] font-semibold tracking-widest uppercase text-blue-200/60 mt-2">
            {stat.label}
          </div>
          <div className="font-sans text-[10px] text-blue-100/40 mt-1 hidden sm:block">
            {stat.description}
          </div>
        </div>
      ))}
    </div>
  );
});

StatsStrip.displayName = 'StatsStrip';
