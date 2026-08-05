'use client';

import { memo } from 'react';

export interface SimulationCanvasProps {
  className?: string;
}

export const SimulationCanvas = memo(function SimulationCanvas({
  className = '',
}: SimulationCanvasProps) {
  return (
    <div
      className={`flex-1 rounded-2xl bg-[#0c0e12]/60 border border-white/5 relative overflow-hidden flex items-center justify-center min-h-[260px] ${className}`}
    >
      {/* Radial Grid Background Pattern */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      {/* Vector Interactive Graphics Container */}
      <div className="relative w-3/4 h-3/4 max-w-md max-h-[300px]">
        {/* X & Y Axes */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-[#e2e2e8]/30" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-px h-full bg-[#e2e2e8]/30" aria-hidden="true" />

        {/* Vector Force Arrow 1 (F_net) */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#2e5bff] to-[#b8c3ff] origin-left rotate-[-35deg] transition-all duration-700 ease-out shadow-[0_0_12px_rgba(46,91,255,0.6)]"
          style={{ width: '65%' }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-[#b8c3ff]" />
          <span className="absolute -top-6 right-2 text-xs font-mono font-bold text-[#b8c3ff] bg-[#111318]/80 px-1.5 py-0.5 rounded border border-white/10">
            F_net
          </span>
        </div>

        {/* Vector Acceleration Arrow 2 (a) */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#00a572] to-[#6ffbbe] origin-left rotate-[-35deg] transition-all duration-700 ease-out shadow-[0_0_12px_rgba(111,251,190,0.6)]"
          style={{ width: '45%' }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-[#6ffbbe]" />
          <span className="absolute top-2 right-0 text-xs font-mono font-bold text-[#6ffbbe] bg-[#111318]/80 px-1.5 py-0.5 rounded border border-white/10">
            a (accel)
          </span>
        </div>
      </div>
    </div>
  );
});

SimulationCanvas.displayName = 'SimulationCanvas';
