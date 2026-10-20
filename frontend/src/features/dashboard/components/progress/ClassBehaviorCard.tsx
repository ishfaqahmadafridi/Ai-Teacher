'use client';

import { memo } from 'react';
import { ClassBehaviorBanBanner } from './ClassBehaviorBanBanner';
import { ClassBehaviorHeader } from './ClassBehaviorHeader';
import { ClassBehaviorWarnings } from './ClassBehaviorWarnings';
import { ClassConductRulesDialog } from './ClassConductRulesDialog';
import { ClassBehaviorMetrics } from './ClassBehaviorMetrics';
import { useClassBehaviorCard } from '../../hooks/useClassBehaviorCard';
import type { ClassBehaviorCardProps } from '../../types/progress.types';

export const ClassBehaviorCard = memo(function ClassBehaviorCard({
  metrics,
  onAttemptUnban,
  className = '',
}: ClassBehaviorCardProps) {
  const { banStatus, isBanned, handleFineClick, isRulesOpen, closeRules } = useClassBehaviorCard({ metrics, onAttemptUnban });

  return (
    <div
      className={`bg-dashboard-panel border rounded-3xl p-6 sm:p-8 shadow-none space-y-6 ${
        isBanned ? 'border-dashboard-danger/60 bg-dashboard-danger/5' : 'border-dashboard-border'
      } ${className}`}
    >
      {isRulesOpen && <ClassConductRulesDialog banStatus={banStatus} onClose={closeRules} />}
      <ClassBehaviorBanBanner metrics={metrics} banStatus={banStatus} handleFineClick={handleFineClick} />
      <ClassBehaviorHeader metrics={metrics} banStatus={banStatus} handleFineClick={handleFineClick} />
      <ClassBehaviorWarnings metrics={metrics} banStatus={banStatus} handleFineClick={handleFineClick} />
      <ClassBehaviorMetrics metrics={metrics} banStatus={banStatus} handleFineClick={handleFineClick} />
    </div>
  );
});

ClassBehaviorCard.displayName = 'ClassBehaviorCard';
