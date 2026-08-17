'use client';

import { memo } from 'react';
import { useIntroScreen } from '../../hooks/useIntroScreen';
import { BackgroundCanvas } from './BackgroundCanvas';
import { LandingNavbar } from './LandingNavbar';
import { NextGenBadge } from './NextGenBadge';
import { HeroSection } from './HeroSection';
import { CTAButton } from './CTAButton';
import { CategoryScrollingTracks } from './CategoryScrollingTracks';

export const IntroScreen = memo(function IntroScreen() {
  const { handleEnterPlatform, handleLogin } = useIntroScreen();

  return (
    <div
      className="min-h-screen w-full bg-[#0b1017] text-white font-sans overflow-x-hidden relative"
      style={{
        fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
      }}
    >
      {/* Dynamic Background Particle & Glow Canvas */}
      <BackgroundCanvas />

      {/* Sticky Glass Navbar - Logo & Name Only */}
      <LandingNavbar onEnterApp={handleEnterPlatform} onLogin={handleLogin} />

      {/* Main Page Content Wrapper */}
      <div className="relative z-10 w-full flex flex-col pt-20 pb-10">
        {/* Hero Banner Section - Compact Padding */}
        <section className="relative flex flex-col items-center justify-center pt-6 pb-8 px-6 text-center max-w-7xl mx-auto w-full z-10">
          <NextGenBadge />
          <HeroSection />
          <CTAButton onNavigate={handleEnterPlatform} />
        </section>

        {/* Marquee Category Scrolling Tracks */}
        <CategoryScrollingTracks />
      </div>
    </div>
  );
});

IntroScreen.displayName = 'IntroScreen';
export default IntroScreen;
