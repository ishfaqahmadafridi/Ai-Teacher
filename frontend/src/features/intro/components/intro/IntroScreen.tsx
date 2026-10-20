'use client';

import { memo } from 'react';
import { useIntroScreen } from '../../hooks/useIntroScreen';
import { LandingNavbar } from './LandingNavbar';
import { NextGenBadge } from './NextGenBadge';
import { HeroSection } from './HeroSection';
import { CTAButton } from './CTAButton';
import { CategoryScrollingTracks } from './CategoryScrollingTracks';

export const IntroScreen = memo(function IntroScreen() {
  const { handleEnterPlatform, handleLogin } = useIntroScreen();

  return (
    <div
      className="min-h-screen w-full bg-dashboard-bg text-dashboard-text font-sans overflow-x-hidden relative"
      style={{
        fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
      }}
    >

      {/* Brand navigation */}
      <LandingNavbar onEnterApp={handleEnterPlatform} onLogin={handleLogin} />

      {/* Main Page Content Wrapper */}
      <div className="relative z-10 w-full flex flex-col pt-24 sm:pt-32 pb-12">
        {/* Hero Banner Section - Compact Padding */}
        <section className="relative flex flex-col items-center justify-center pt-8 sm:pt-12 pb-12 sm:pb-16 px-6 text-center max-w-7xl mx-auto w-full z-10">
          <NextGenBadge />
          <HeroSection />
          <CTAButton onNavigate={handleEnterPlatform} />
        </section>

        {/* Fields of study */}
        <CategoryScrollingTracks />
      </div>
    </div>
  );
});

IntroScreen.displayName = 'IntroScreen';
export default IntroScreen;
