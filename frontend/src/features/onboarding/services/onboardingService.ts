import { apiClient } from '@/lib/api';
import type { StudentProfileData, EducationLevel, AcademicYear } from '../types';

export class OnboardingService {
  static async submitStep3Profile(profile: StudentProfileData): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>('/api/onboarding/profile/', profile);
    return response.data;
  }

  static async submitStep4Education(level: EducationLevel): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>('/api/onboarding/education-level/', { level });
    return response.data;
  }

  static async submitStep5AcademicYear(year: AcademicYear): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>('/api/onboarding/academic-year/', { year });
    return response.data;
  }

  static async submitStep6Interests(interests: string[]): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>('/api/onboarding/interests/', { interests });
    return response.data;
  }
}

export default OnboardingService;
