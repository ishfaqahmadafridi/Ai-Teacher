'use client';

import { useProfileMutation } from '../../auth/hooks/useAuthQueries';
import { usePathname, useRouter } from 'next/navigation';
import { useOnboardingStore } from '../state/onboardingStore';
import { OnboardingService } from '../services/onboardingService';
import { useAuthStore } from '../../auth/state/authStore';
import type { AuthUser } from '../../auth/types';
import type { EducationLevel, AcademicYear } from '../types';

export function useOnboarding() {
  const router = useRouter();
  const pathname = usePathname();
  const mutation = useProfileMutation();
  const store = useOnboardingStore();
  const routeStep = Number(pathname.match(/step-(\d+)$/)?.[1]) || store.currentStep;

  const handleNextStep = async () => {
    const nextStep = routeStep + 1;
    if (nextStep > 6) {
      router.push('/dashboard');
    } else {
      store.setStep(nextStep);
      router.push(`/onboarding/step-${nextStep}`);
    }
  };

  const handlePrevStep = () => {
    const prevStep = routeStep - 1;
    if (prevStep >= 3) {
      store.setStep(prevStep);
      router.push(`/onboarding/step-${prevStep}`);
    }
  };

  const persistStep = async (save: () => Promise<AuthUser>, next: () => void) => {
    if (useOnboardingStore.getState().isLoading) return;
    const session = useAuthStore.getState();
    store.setLoading(true);
    store.setError(null);
    try {
      const user = await mutation.mutateAsync(save);
      const current = useAuthStore.getState();
      if (!current.user || current.user.id !== session.user?.id || !current.accessToken) {
        throw new Error('The signed-in account changed.');
      }
      current.setUser(user, current.accessToken);
      next();
    } catch (error: unknown) {
      store.setError(error instanceof Error ? error.message : 'Your details could not be saved. Please try again.');
    } finally {
      store.setLoading(false);
    }
  };

  const submitProfile = () => {
    if (!store.profile.timezone.trim()) {
      store.setError('Please select your timezone before continuing, or choose Skip for now.');
      return;
    }
    return persistStep(
      () => OnboardingService.submitStep3Profile(store.profile), handleNextStep
    );
  };
  const selectEducationLevel = (level: EducationLevel) => persistStep(
    () => OnboardingService.submitStep4Education(level),
    () => { store.setEducationLevel(level); handleNextStep(); }
  );
  const selectAcademicYear = (year: AcademicYear) => persistStep(
    () => OnboardingService.submitStep5AcademicYear(year),
    () => { store.setAcademicYear(year); handleNextStep(); }
  );
  const submitInterests = () => {
    if (store.selectedInterests.length !== 1) {
      store.setError('Select exactly one field of study before continuing.');
      return;
    }
    return persistStep(
      () => OnboardingService.submitStep6Interests(store.selectedInterests),
      () => router.push('/dashboard')
    );
  };

  const skipStep = (step: number) => {
    if (useOnboardingStore.getState().isLoading) return;
    if (step === 6) {
      return persistStep(
        () => OnboardingService.completeOnboarding(),
        () => router.push('/dashboard')
      );
    }
    store.setError(null);
    store.setStep(step + 1);
    router.push(`/onboarding/step-${step + 1}`);
  };

  return {
    ...store,
    handleNextStep,
    handlePrevStep,
    submitProfile,
    selectEducationLevel,
    selectAcademicYear,
    submitInterests,
    skipStep,
  };
}
