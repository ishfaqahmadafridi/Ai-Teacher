import { apiClient } from '@/lib/api';
import type { RegisterFormData, LoginFormData, AuthUser } from '../types';

export interface AuthTokenResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export class AuthService {
  /**
   * Creates a new user account.
   */
  static async register(data: RegisterFormData): Promise<AuthTokenResponse> {
    const response = await apiClient.post<AuthTokenResponse>('/api/auth/register/', {
      first_name: data.firstName,
      last_name: data.lastName,
      username: data.username || undefined,
      country_code: data.countryCode,
      mobile: data.mobile || undefined,
      email: data.email,
      password: data.password,
    });
    return response.data;
  }

  /**
   * Authenticates an existing user.
   */
  static async login(data: LoginFormData): Promise<AuthTokenResponse> {
    const response = await apiClient.post<AuthTokenResponse>('/api/auth/login/', {
      email: data.email,
      password: data.password,
    });
    return response.data;
  }

  /**
   * Authenticates user via Google OAuth ID token.
   */
  static async loginWithGoogle(idToken: string): Promise<AuthTokenResponse> {
    const response = await apiClient.post<AuthTokenResponse>('/api/auth/google/', {
      id_token: idToken,
    });
    return response.data;
  }

  /**
   * Logs the current user out.
   */
  static async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/api/auth/logout/', { refresh: refreshToken });
  }

  /**
   * Fetches the currently authenticated user profile.
   */
  static async getProfile(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>('/api/auth/me/');
    return response.data;
  }

  /**
   * Verifies account OTP code.
   */
  static async verifyOtp(method: string, code: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>('/api/auth/verify-otp/', {
      method,
      code,
    });
    return response.data;
  }

  /**
   * Resends OTP code.
   */
  static async resendOtp(method: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>('/api/auth/resend-otp/', {
      method,
    });
    return response.data;
  }
}

export default AuthService;

