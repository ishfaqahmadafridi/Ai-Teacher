'use client';

import { useCallback, useState } from 'react';
import { checkBanStatus } from '../utilities/progressUtils';
import type { ClassBehaviorCardProps } from '../types/progress.types';

export function useClassBehaviorCard({ metrics, onAttemptUnban }: ClassBehaviorCardProps) {
  const banStatus = checkBanStatus(metrics);

  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const handleFineClick = useCallback(() => {
    setIsRulesOpen(true);
    if (banStatus.isBanned) onAttemptUnban?.();
  }, [banStatus.isBanned, onAttemptUnban]);
  const closeRules = useCallback(() => setIsRulesOpen(false), []);

  return { banStatus, isBanned: banStatus.isBanned, handleFineClick, isRulesOpen, closeRules };
}
