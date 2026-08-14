'use client';

import { memo } from 'react';
import type { HeroStudyIllustrationProps } from '../../types';

export const HeroStudyIllustration = memo(function HeroStudyIllustration({
  className = '',
}: HeroStudyIllustrationProps) {
  return (
    <div className={`z-10 shrink-0 flex justify-center md:justify-end mt-2 md:mt-0 ${className}`}>
      <div className="w-56 h-36 sm:w-64 sm:h-44 md:w-72 md:h-48 rounded-2xl overflow-hidden shadow-xl border border-[#38BDF8]/20 group">
        <img
          src="/images/student_study_hero.jpg"
          alt="Student Studying Illustration"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
});

HeroStudyIllustration.displayName = 'HeroStudyIllustration';
