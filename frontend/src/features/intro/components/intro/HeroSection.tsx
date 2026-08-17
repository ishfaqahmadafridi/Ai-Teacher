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
      {/* Main Headline */}
      <h1
        className="m-0 text-center font-extrabold tracking-tight max-w-[950px]"
        style={{
          fontSize: 'clamp(42px, 6.5vw, 88px)',
          lineHeight: 1.08,
          animation: 'intro-titleReveal 1.0s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
        }}
      >
        <span className="block text-[#f0f6ff]">{HERO_TITLE_PREFIX}</span>
        <span
          className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-[length:200%_auto] bg-clip-text text-transparent"
          style={{
            animation: 'intro-shimmer 5s linear infinite',
          }}
        >
          {HERO_TITLE_GRADIENT}
        </span>
      </h1>

      {/* Subtitle / Description */}
      <p
        className="mt-6 mb-0 font-sans text-center text-blue-100/70 max-w-[640px]"
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
