'use client';

import { memo } from 'react';
import { ClassBehaviorBanBanner } from './ClassBehaviorBanBanner';
import { ClassBehaviorHeader } from './ClassBehaviorHeader';
import { ClassBehaviorWarnings } from './ClassBehaviorWarnings';
import { ClassBehaviorMetrics } from './ClassBehaviorMetrics';
import { useClassBehaviorCard } from '../../hooks/useClassBehaviorCard';
import type { ClassBehaviorCardProps } from '../../types/progress.types';

export const ClassBehaviorCard = memo(function ClassBehaviorCard({
  metrics,
  onAttemptUnban,
  className = '',
}: ClassBehaviorCardProps) {
  const { banStatus, isBanned, handleFineClick } = useClassBehaviorCard({ metrics, onAttemptUnban });

  return (
    <div
      className={`bg-[#0F172A] border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 ${
        isBanned ? 'border-[#EF4444]/60 bg-[#160B0E]' : 'border-[#1E293B]'
      } ${className}`}
    >
      <ClassBehaviorBanBanner metrics={metrics} banStatus={banStatus} handleFineClick={handleFineClick} />
      <ClassBehaviorHeader metrics={metrics} banStatus={banStatus} handleFineClick={handleFineClick} />
      <ClassBehaviorWarnings metrics={metrics} banStatus={banStatus} handleFineClick={handleFineClick} />
      <ClassBehaviorMetrics metrics={metrics} banStatus={banStatus} handleFineClick={handleFineClick} />
    </div>
  );
});

ClassBehaviorCard.displayName = 'ClassBehaviorCard';
