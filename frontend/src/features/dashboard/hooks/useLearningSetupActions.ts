'use client';

import { useState } from 'react';
import { useAuthStore } from '@/features/auth/state/authStore';
import { useUpdateProfileMutation } from '@/features/auth/hooks/useAuthQueries';
import { useOnboardingStore } from '@/features/onboarding/state/onboardingStore';
import { getLearningReadiness } from '@/features/onboarding/utils/learningReadiness';

export function useLearningSetupActions() {
  const user = useAuthStore((state) => state.user);
  const { isReady, missing } = getLearningReadiness(user);
  const [timezone, setTimezone] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const mutation = useUpdateProfileMutation();

  const saveTimezone = async () => {
    if (!timezone || mutation.isPending) return;
    setSaveError(null);
    try {
      const saved = await mutation.mutateAsync({ timezone });
      useOnboardingStore.getState().updateProfile({ timezone: saved.timezone });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Timezone could not be saved.');
    }
  };

  return { isReady, missing, needsTimezone: !!user && !user.timezone, timezone, setTimezone, saveTimezone, saveError, isSaving: mutation.isPending };
}
