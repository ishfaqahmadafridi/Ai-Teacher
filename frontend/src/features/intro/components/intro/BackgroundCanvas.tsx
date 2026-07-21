'use client';

import { ParticleCanvas } from './ParticleCanvas';
import { FloatingSymbols } from './FloatingSymbols';
import { AmbientOrbs } from './AmbientOrbs';

export function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <ParticleCanvas />
      <FloatingSymbols />
      <AmbientOrbs />
    </div>
  );
}
