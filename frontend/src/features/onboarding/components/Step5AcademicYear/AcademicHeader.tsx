'use client';

import { memo } from 'react';
import { AcademicProgressHeader } from './AcademicProgressHeader';

export const AcademicHeader = memo(function AcademicHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-8 max-w-3xl mx-auto space-y-4 font-['Hanken_Grotesk',sans-serif]">
      <AcademicProgressHeader />

      <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
        Where Are You in Your Learning Journey?
      </h1>
      <p className="text-[#94A3B8] text-base md:text-lg max-w-xl mx-auto">
        We'll customize your lessons based on your current academic level.
      </p>
    </div>
  );
});

AcademicHeader.displayName = 'AcademicHeader';

