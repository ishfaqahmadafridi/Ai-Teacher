'use client';

import { memo } from 'react';
import type { HeroBackgroundParticlesProps } from '../../types';

export const HeroBackgroundParticles = memo(function HeroBackgroundParticles({
  className = '',
}: HeroBackgroundParticlesProps) {
  return (
    <div className={`absolute inset-0 opacity-20 pointer-events-none ${className}`} aria-hidden="true">
      <svg className="w-full h-full" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="120" cy="40" r="1.5" fill="white" />
        <circle cx="280" cy="80" r="1" fill="white" />
        <circle cx="450" cy="30" r="2" fill="white" />
        <circle cx="620" cy="90" r="1.5" fill="white" />
        <circle cx="720" cy="50" r="1" fill="white" />
      </svg>
    </div>
  );
});

HeroBackgroundParticles.displayName = 'HeroBackgroundParticles';
