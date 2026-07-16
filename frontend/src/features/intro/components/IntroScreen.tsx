'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ParticleCanvas } from './ParticleCanvas';
import { FloatingSymbols } from './FloatingSymbols';
import { CategoryTrack } from './CategoryTrack';
import { AmbientOrbs } from './AmbientOrbs';
import { NextGenBadge } from './NextGenBadge';
import { HeroSection } from './HeroSection';
import { CTAButton } from './CTAButton';
import { StatsStrip } from './StatsStrip';
import { TransitionOverlay } from './TransitionOverlay';
import { TRACK_1, TRACK_2, TRACK_3 } from '../constants/categories';

export function IntroScreen() {
  const router = useRouter();
  const [entered, setEntered] = useState(false);

  // Prefetch classroom simulator route for seamless load
  useEffect(() => {
    router.prefetch('/classroom');
  }, [router]);

  // Handle route transition with animation timing cleanup
  useEffect(() => {
    if (!entered) return;

    const timer = setTimeout(() => {
      router.push('/classroom');
    }, 1800);

    return () => clearTimeout(timer);
  }, [entered, router]);

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden bg-[#020714] select-none text-white z-50 font-sans"
      style={{
        fontFamily: 'var(--font-outfit), var(--font-inter), sans-serif',
      }}
    >
      {/* Background & Particles */}
      <ParticleCanvas />
      <FloatingSymbols />
      <AmbientOrbs />

      {/* Main Content Layout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
        <NextGenBadge />
        <HeroSection />
        <CTAButton onClick={() => setEntered(true)} />
        <StatsStrip />
      </div>

      {/* Category Scrolling Tracks */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex flex-col gap-2.5 pb-8 pointer-events-none"
        style={{
          animation: 'intro-fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 2s both',
        }}
      >
        <CategoryTrack items={TRACK_1} className="intro-category-track-1" />
        <CategoryTrack items={TRACK_2} className="intro-category-track-2" />
        <CategoryTrack items={TRACK_3} className="intro-category-track-3" />
      </div>

      {/* Bottom Vignette Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#020714] via-[#020714]/70 to-transparent pointer-events-none z-[9]" />

      {/* Transition Loader */}
      {entered && <TransitionOverlay />}
    </div>
  );
}

export default IntroScreen;
