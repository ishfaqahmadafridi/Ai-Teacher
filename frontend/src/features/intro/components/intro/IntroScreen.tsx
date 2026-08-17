'use client';

import { memo } from 'react';
import { useIntroScreen } from '../../hooks/useIntroScreen';
import { BackgroundCanvas } from './BackgroundCanvas';
import { LandingNavbar } from './LandingNavbar';
import { NextGenBadge } from './NextGenBadge';
import { HeroSection } from './HeroSection';
import { StatsStrip } from './StatsStrip';
import { CTAButton } from './CTAButton';
import { CategoryScrollingTracks } from './CategoryScrollingTracks';
import { FeatureGridSection } from './FeatureGridSection';
import { AITeacherShowcase } from './AITeacherShowcase';
import { LandingFooter } from './LandingFooter';

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

      {/* Sticky Glass Navbar */}
      <LandingNavbar onEnterApp={handleEnterPlatform} onLogin={handleLogin} />

      {/* Main Page Content Wrapper */}
      <div className="relative z-10 w-full flex flex-col pt-24">
        {/* Hero Banner Section */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-16 pb-12 px-6 text-center max-w-7xl mx-auto w-full z-10">
          <NextGenBadge />
          <HeroSection />
          <CTAButton onNavigate={handleEnterPlatform} />
          <StatsStrip />
        </section>

        {/* Marquee Category Scrolling Tracks */}
        <CategoryScrollingTracks />

        {/* Core Architecture Feature Grid */}
        <FeatureGridSection />

        {/* AI Physics Teacher Classroom Showcase */}
        <AITeacherShowcase />

        {/* Footer */}
        <LandingFooter onNavigate={handleEnterPlatform} />
      </div>
    </div>
  );
});

IntroScreen.displayName = 'IntroScreen';
export default IntroScreen;
