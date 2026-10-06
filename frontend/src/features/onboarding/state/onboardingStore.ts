import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthUser } from '../../auth/types';
import type { OnboardingState, StudentProfileData, EducationLevel, AcademicYear } from '../types';

interface OnboardingActions {
  bindUser: (user: AuthUser) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStep: (step: number) => void;
  updateProfile: (profile: Partial<StudentProfileData>) => void;
  setEducationLevel: (level: EducationLevel) => void;
  setAcademicYear: (year: AcademicYear) => void;
  toggleInterest: (interest: string) => void;
  resetOnboarding: () => void;
}

const initialState: OnboardingState = {
  userId: null,
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

        bindUser: (user) => set({
          ...initialState, userId: user.id,
          currentStep: user.onboardingCompleted ? 6 : 3,
          profile: {
            fullName: [user.firstName, user.lastName].filter(Boolean).join(' '),
            dob: user.dob ?? '', country: user.country, timezone: user.timezone,
            language: user.preferredLanguage || initialState.profile.language,
            avatarUrl: user.avatarUrl,
          },
          educationLevel: (user.educationLevel || null) as EducationLevel | null,
          academicYear: (user.academicYear || null) as AcademicYear | null,
          selectedInterests: user.selectedInterests,
        }, false, 'onboarding/bindUser'),

        setLoading: (isLoading) => set({ isLoading }, false, 'onboarding/setLoading'),
        setError: (error) => set({ error }, false, 'onboarding/setError'),
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
