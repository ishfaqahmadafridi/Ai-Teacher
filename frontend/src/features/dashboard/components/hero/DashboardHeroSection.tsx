'use client';

import { memo } from 'react';
import { useDashboardHeroSection } from '../../hooks';
import { HeroBackgroundParticles } from './HeroBackgroundParticles';
import { HeroGreetingContent } from './HeroGreetingContent';
import { HeroStudyIllustration } from './HeroStudyIllustration';
import type { DashboardHeroSectionProps } from '../../types';

export const DashboardHeroSection = memo(function DashboardHeroSection({
  studentName = 'John',
  weeklyProgressPercent = 75,
  greeting: customGreeting,
  className = '',
}: DashboardHeroSectionProps) {
  const { greeting } = useDashboardHeroSection({ greeting: customGreeting });

  return (
    <section
      className={`bg-gradient-to-r from-[#0C3B73] via-[#0E4482] to-[#0A305E] rounded-20 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row justify-between items-center relative overflow-hidden font-['Hanken_Grotesk',sans-serif] shadow-lg gap-6 ${className}`}
    >
      {/* Decorative Star Particles */}
      <HeroBackgroundParticles />

      {/* Greeting Title & Subtitle */}
      <HeroGreetingContent
        greeting={greeting}
        studentName={studentName}
        weeklyProgressPercent={weeklyProgressPercent}
      />

      {/* Desk Study SVG Illustration */}
      <HeroStudyIllustration />
    </section>
  );
});

DashboardHeroSection.displayName = 'DashboardHeroSection';
