'use client';

import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '../state/onboardingStore';
import { OnboardingService } from '../services/onboardingService';
import type { EducationLevel, AcademicYear } from '../types';

export function useOnboarding() {
  const router = useRouter();
  const store = useOnboardingStore();

  const handleNextStep = async () => {
    const nextStep = store.currentStep + 1;
    if (nextStep > 6) {
      router.push('/classroom');
    } else {
      store.setStep(nextStep);
      router.push(`/onboarding/step-${nextStep}`);
    }
  };

  const handlePrevStep = () => {
    const prevStep = store.currentStep - 1;
    if (prevStep >= 3) {
      store.setStep(prevStep);
      router.push(`/onboarding/step-${prevStep}`);
    }
  };

  const submitProfile = async () => {
    try {
      await OnboardingService.submitStep3Profile(store.profile);
    } catch {
      // Mock fallback
    }
    handleNextStep();
  };

  const selectEducationLevel = async (level: EducationLevel) => {
    store.setEducationLevel(level);
    try {
      await OnboardingService.submitStep4Education(level);
    } catch {
      // Mock fallback
    }
    handleNextStep();
  };

  const selectAcademicYear = async (year: AcademicYear) => {
    store.setAcademicYear(year);
    try {
      await OnboardingService.submitStep5AcademicYear(year);
    } catch {
      // Mock fallback
    }
    handleNextStep();
  };

  const submitInterests = async () => {
    try {
      await OnboardingService.submitStep6Interests(store.selectedInterests);
    } catch {
      // Mock fallback
    }
    router.push('/classroom');
  };

  return {
    ...store,
    handleNextStep,
    handlePrevStep,
    submitProfile,
    selectEducationLevel,
    selectAcademicYear,
    submitInterests,
  };
}
