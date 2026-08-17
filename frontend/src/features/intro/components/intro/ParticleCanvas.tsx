'use client';

import { memo, useRef } from 'react';
import { useParticleCanvas } from '../../hooks/useParticleCanvas';

export const ParticleCanvas = memo(function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticleCanvas(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
    />
  );
});

ParticleCanvas.displayName = 'ParticleCanvas';
