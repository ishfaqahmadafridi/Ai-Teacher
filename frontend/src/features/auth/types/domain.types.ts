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
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
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
