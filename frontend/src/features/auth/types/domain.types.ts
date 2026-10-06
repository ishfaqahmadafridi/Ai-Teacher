import type { ReactNode } from 'react';

// Auth domain models & payload types

export type AuthRole = 'student' | 'teacher' | 'admin';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  countryCode?: string;
  mobile?: string;
  role: AuthRole;
  avatarUrl?: string;
  coverUrl?: string;
  createdAt: string;
  isVerified: boolean;
  bio: string;
  gradeLevel: string;
  preferredLanguage: string;
  dob: string | null;
  country: string;
  timezone: string;
  educationLevel: string;
  academicYear: string;
  selectedInterests: string[];
  onboardingCompleted: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  countryCode: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponseData {
  user: AuthUser;
  access: string;
  refresh?: string;
}

export interface ApiAuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  country_code: string;
  mobile: string | null;
  role: AuthRole;
  avatar_url: string | null;
  cover_url: string;
  created_at: string;
  is_verified: boolean;
  bio: string;
  grade_level: string;
  preferred_language: string;
  dob: string | null;
  country: string;
  timezone: string;
  education_level: string;
  academic_year: string;
  selected_interests: string[];
  onboarding_completed: boolean;
}

export type ProfileUpdateData = Partial<Pick<ApiAuthUser,
  'first_name' | 'last_name' | 'email' | 'country_code' | 'mobile' | 'avatar_url' |
  'cover_url' | 'bio' | 'grade_level' | 'preferred_language' | 'dob' | 'country' |
  'timezone' | 'education_level' | 'academic_year' | 'selected_interests' | 'onboarding_completed'
>>;

export interface ProtectedRouteProps {
  children: ReactNode;
}
