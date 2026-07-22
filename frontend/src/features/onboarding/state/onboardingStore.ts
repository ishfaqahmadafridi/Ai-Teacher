import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { OnboardingState, StudentProfileData, EducationLevel, AcademicYear } from '../types';

interface OnboardingActions {
  setStep: (step: number) => void;
  updateProfile: (profile: Partial<StudentProfileData>) => void;
  setEducationLevel: (level: EducationLevel) => void;
  setAcademicYear: (year: AcademicYear) => void;
  toggleInterest: (interest: string) => void;
  resetOnboarding: () => void;
}

const initialState: OnboardingState = {
  currentStep: 3,
  profile: {
    fullName: '',
    dob: '',
    country: '',
    timezone: '',
    language: 'English (US)',
  },
  educationLevel: null,
  academicYear: null,
  selectedInterests: [],
  isLoading: false,
  error: null,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setStep: (step) => set({ currentStep: step }, false, 'onboarding/setStep'),

        updateProfile: (data) =>
          set(
            (state) => ({
              profile: { ...state.profile, ...data },
            }),
            false,
            'onboarding/updateProfile'
          ),

        setEducationLevel: (level) => set({ educationLevel: level }, false, 'onboarding/setEducationLevel'),

        setAcademicYear: (year) => set({ academicYear: year }, false, 'onboarding/setAcademicYear'),

        toggleInterest: (interest) =>
          set(
            (state) => {
              const exists = state.selectedInterests.includes(interest);
              const updated = exists
                ? state.selectedInterests.filter((i) => i !== interest)
                : [...state.selectedInterests, interest];
              return { selectedInterests: updated };
            },
            false,
            'onboarding/toggleInterest'
          ),

        resetOnboarding: () => set(initialState, false, 'onboarding/resetOnboarding'),
      }),
      { name: 'onboarding-store' }
    ),
    { name: 'OnboardingStore' }
  )
);
