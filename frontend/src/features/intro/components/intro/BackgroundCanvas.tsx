'use client';

import { memo } from 'react';
import { ParticleCanvas } from './ParticleCanvas';
import { FloatingSymbols } from './FloatingSymbols';
import { AmbientOrbs } from './AmbientOrbs';

export const BackgroundCanvas = memo(function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <ParticleCanvas />
      <FloatingSymbols />
      <AmbientOrbs />
    </div>
  );
});

BackgroundCanvas.displayName = 'BackgroundCanvas';
