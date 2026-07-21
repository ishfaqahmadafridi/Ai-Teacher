'use client';

import { BackgroundCanvas } from './BackgroundCanvas';
import { NextGenBadge } from './NextGenBadge';
import { HeroSection } from './HeroSection';
import { StatsStrip } from './StatsStrip';
import { CTAButton } from './CTAButton';
import { CategoryScrollingTracks } from './CategoryScrollingTracks';

export function IntroScreen() {
  return (
    <div
      className="min-h-screen w-full bg-[#0d141d] text-white font-sans overflow-x-hidden relative"
      style={{
        fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
      }}
    >
      {/* Background & Particles (fixed in background) */}
      <BackgroundCanvas />

      {/* Main Page Layout Wrapper */}
      <div className="relative z-10 w-full flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-16 px-6 text-center max-w-7xl mx-auto w-full z-10">
          <NextGenBadge />
          <HeroSection />
          <StatsStrip />
          
          {/* Main Enter Platform Button */}
          <CTAButton />
        </section>

        {/* Category Scrolling Tracks */}
        <CategoryScrollingTracks />
      </div>
    </div>
  );
}

export default IntroScreen;
