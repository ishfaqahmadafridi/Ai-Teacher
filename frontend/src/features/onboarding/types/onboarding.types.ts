export type EducationLevel = 'primary' | 'middle' | 'high_school' | 'undergraduate' | 'postgraduate' | 'professional' | 'self_learner';

export type AcademicYear = 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate';

export interface StudentProfileData {
  fullName: string;
  dob: string;
  country: string;
  timezone: string;
  language?: string;
  avatarUrl?: string;
}

export interface OnboardingState {
  currentStep: number;
  profile: StudentProfileData;
  educationLevel: EducationLevel | null;
  academicYear: AcademicYear | null;
  selectedInterests: string[];
  isLoading: boolean;
  error: string | null;
}

export interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}
