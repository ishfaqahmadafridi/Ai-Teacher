'use client';

import { useRef } from 'react';
import { useParticleCanvas } from '../hooks/useParticleCanvas';

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticleCanvas(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] w-full h-full"
    />
  );
}
