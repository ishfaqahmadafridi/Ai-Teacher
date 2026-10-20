'use client';

import { memo } from 'react';
import { useDashboardHeroSection } from '../../hooks';
import { HeroGreetingContent } from './HeroGreetingContent';
import { HeroStudyIllustration } from './HeroStudyIllustration';
import type { DashboardHeroSectionProps } from '../../types';

export const DashboardHeroSection = memo(function DashboardHeroSection({ studentName = 'Student', weeklyProgressPercent = 0, greeting: customGreeting, className = '' }: DashboardHeroSectionProps) {
  const { greeting, imageSrc, imageAlt, sceneStyle } = useDashboardHeroSection({ greeting: customGreeting });
  return (
    <section className={`flex flex-col items-start justify-between gap-6 rounded-xl border border-dashboard-border bg-dashboard-panel p-5 sm:p-7 lg:flex-row lg:items-center ${className}`}>
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-dashboard-muted">Learning dashboard</p>
        <HeroGreetingContent greeting={greeting} studentName={studentName} weeklyProgressPercent={weeklyProgressPercent} />
      </div>
      <HeroStudyIllustration imageSrc={imageSrc} imageAlt={imageAlt} sceneStyle={sceneStyle} />
    </section>
  );
});
DashboardHeroSection.displayName = 'DashboardHeroSection';
