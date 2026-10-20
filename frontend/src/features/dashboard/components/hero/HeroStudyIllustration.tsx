'use client';

import { memo } from 'react';
import Image from 'next/image';
import '../../styles/hero-scene.css';
import type { HeroStudyIllustrationProps } from '../../types';

export const HeroStudyIllustration = memo(function HeroStudyIllustration({
  sceneStyle,
  imageSrc,
  imageAlt,
  className = '',
}: HeroStudyIllustrationProps) {
  return (
    <div className={`z-10 w-full min-w-0 lg:w-auto shrink-0 flex justify-center md:justify-end mt-2 md:mt-0 ${className}`}>
      <div className="w-full max-w-[31rem] sm:w-[24rem] xl:w-[31rem] aspect-[3/2] rounded-2xl overflow-hidden hero-scene relative shadow-none border border-dashboard-primary/20" style={sceneStyle}>
        <div aria-hidden="true" className="hero-sky hero-sky-day" />
        <div aria-hidden="true" className="hero-sky hero-sky-sunset" />
        <div aria-hidden="true" className="hero-sky hero-sky-night" />
        <div aria-hidden="true" className="hero-stars" />
        <div aria-hidden="true" className="hero-sun" />
        <div aria-hidden="true" className="hero-moon" />
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1280px) 496px, (min-width: 640px) 384px, calc(100vw - 80px)"
          className="hero-scene-foreground w-full h-full object-cover"
        />
        <div aria-hidden="true" className="hero-room-night" />
        <div aria-hidden="true" className="hero-room-sunset" />
        <div aria-hidden="true" className="hero-lamp" />
      </div>
    </div>
  );
});

HeroStudyIllustration.displayName = 'HeroStudyIllustration';
