import { apiClient } from '@/lib/api';
import type { RegisterFormData, LoginFormData, AuthUser, ApiAuthUser, ProfileUpdateData } from '../types';

import { mapAuthUser } from '../utilities/userUtils';

export interface AuthTokenResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

interface ApiAuthTokenResponse extends Omit<AuthTokenResponse, 'user'> {
  user: ApiAuthUser;
}

export class AuthService {
  /**
   * Creates a new user account.
   */
  static async register(data: RegisterFormData): Promise<AuthTokenResponse> {
    const response = await apiClient.post<ApiAuthTokenResponse>('/api/auth/register/', {
      first_name: data.firstName,
      last_name: data.lastName,
      username: data.username || undefined,
      country_code: data.countryCode,
      mobile: data.mobile || undefined,
      email: data.email,
      password: data.password,
    });
    return { ...response.data, user: mapAuthUser(response.data.user) };
  }

  /**
   * Authenticates an existing user.
   */
  static async login(data: LoginFormData): Promise<AuthTokenResponse> {
    const response = await apiClient.post<ApiAuthTokenResponse>('/api/auth/login/', {
      email: data.email,
      password: data.password,
    });
    return { ...response.data, user: mapAuthUser(response.data.user) };
  }

  /**
   * Authenticates user via Google OAuth ID token.
   */
  static async loginWithGoogle(idToken: string): Promise<AuthTokenResponse> {
    const response = await apiClient.post<ApiAuthTokenResponse>('/api/auth/google/', {
      id_token: idToken,
    });
    return { ...response.data, user: mapAuthUser(response.data.user) };
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
  static async getProfile(signal?: AbortSignal): Promise<AuthUser> {
    const response = await apiClient.get<ApiAuthUser>('/api/auth/me/', { signal });
    return mapAuthUser(response.data);
  }

  static async updateProfile(data: ProfileUpdateData): Promise<AuthUser> {
    const response = await apiClient.patch<ApiAuthUser>('/api/auth/me/', data);
    return mapAuthUser(response.data);
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

