import { AuthService } from '../../auth/services/authService';
import type { StudentProfileData, EducationLevel, AcademicYear } from '../types';
import type { AuthUser } from '../../auth/types';

export class OnboardingService {
  static async completeOnboarding(): Promise<AuthUser> {
    return AuthService.updateProfile({ onboarding_completed: true });
  }

  static async submitStep3Profile(profile: StudentProfileData): Promise<AuthUser> {
    const [firstName, ...lastName] = profile.fullName.trim().split(/\s+/);
    return AuthService.updateProfile({
      first_name: firstName, last_name: lastName.join(' '), dob: profile.dob || null,
      country: profile.country, timezone: profile.timezone,
      preferred_language: profile.language, avatar_url: profile.avatarUrl,
    });
  }

  static async submitStep4Education(level: EducationLevel): Promise<AuthUser> {
    return AuthService.updateProfile({ education_level: level });
  }

  static async submitStep5AcademicYear(year: AcademicYear): Promise<AuthUser> {
    return AuthService.updateProfile({ academic_year: year });
  }

  static async submitStep6Interests(interests: string[]): Promise<AuthUser> {
    return AuthService.updateProfile({ selected_interests: interests, onboarding_completed: true });
  }
}

export default OnboardingService;
