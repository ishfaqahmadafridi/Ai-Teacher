'use client';

import { useCallback } from 'react';
import { checkBanStatus } from '../utilities/progressUtils';
import type { ClassBehaviorCardProps } from '../types/progress.types';

export function useClassBehaviorCard({ metrics, onAttemptUnban }: ClassBehaviorCardProps) {
  const banStatus = checkBanStatus(metrics);

  const handleFineClick = useCallback(() => {
    if (onAttemptUnban) {
      onAttemptUnban();
      return;
    }
    alert(
      '⚠️ PAYMENT NOT ALLOWED:\n\nPaying money or fines for misbehavior is strictly NOT allowed in this application. Your account and email remain banned due to exceeding 3/3 live class disruption warnings.'
    );
  }, [onAttemptUnban]);

  return { banStatus, isBanned: banStatus.isBanned, handleFineClick };
}
