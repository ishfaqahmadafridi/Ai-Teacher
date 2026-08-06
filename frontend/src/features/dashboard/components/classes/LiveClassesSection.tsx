'use client';

import { memo } from 'react';
import { DEFAULT_LIVE_CLASSES } from '../../constants/dashboardConstants';
import { ClassCard } from './ClassCard';
import type { LiveClassesSectionProps } from '../../types/dashboard.types';

export const LiveClassesSection = memo(function LiveClassesSection({
  classes = DEFAULT_LIVE_CLASSES,
  onJoinClass,
  className = '',
}: LiveClassesSectionProps) {
  return (
    <section
      className={`bg-white rounded-20 p-6 card-shadow border border-[#E2E8F0]/50 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-[#0F172A]">
            Enrolled Subject Classes
          </h2>
          <p className="font-['Hanken_Grotesk',sans-serif] text-xs text-[#737686] mt-0.5">
            Real-time schedule progress and live room access for all your enrolled subjects.
          </p>
        </div>
        <button
          type="button"
          className="text-[#2563eb] font-['JetBrains_Mono',monospace] text-xs font-semibold uppercase tracking-wider hover:underline cursor-pointer shrink-0"
        >
          View All ({classes.length})
        </button>
      </div>

      {/* Classes Grid (All Enrolled Classes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {classes.map((classItem) => (
          <ClassCard
            key={classItem.id}
            classItem={classItem}
            onJoinClass={onJoinClass}
          />
        ))}
      </div>
    </section>
  );
});

LiveClassesSection.displayName = 'LiveClassesSection';
