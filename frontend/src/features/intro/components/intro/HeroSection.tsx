'use client';

import { memo } from 'react';
import {
  HERO_TITLE_PREFIX,
  HERO_TITLE_GRADIENT,
  HERO_DESCRIPTION,
} from '../../constants/introConstants';

export const HeroSection = memo(function HeroSection() {
  return (
    <>
      {/* Main Headline - Exactly 2 Lines with Clean Fit */}
      <h1
        className="m-0 text-center font-semibold tracking-[-0.04em] max-w-[60rem] w-full"
        style={{
          fontSize: 'clamp(36px, 5.2vw, 72px)',
          lineHeight: 1.15,
          animation: 'intro-titleReveal 1.0s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
        }}
      >
        <span className="block text-dashboard-text mb-1">{HERO_TITLE_PREFIX}</span>
        <span
          className="block text-dashboard-primary"
        >
          {HERO_TITLE_GRADIENT}
        </span>
      </h1>

      {/* Subtitle / Description */}
      <p
        className="mt-6 mb-0 font-sans text-center text-dashboard-muted max-w-[40rem]"
        style={{
          fontSize: 'clamp(15px, 1.8vw, 19px)',
          lineHeight: 1.65,
          animation: 'intro-subtitleReveal 1.0s cubic-bezier(0.16, 1, 0.3, 1) 0.75s both',
        }}
      >
        {HERO_DESCRIPTION}
      </p>
    </>
  );
});

HeroSection.displayName = 'HeroSection';
