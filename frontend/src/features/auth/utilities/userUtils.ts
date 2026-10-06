import type { ApiAuthUser, AuthUser } from '../types';

/** Translate the API schema once, before any user data enters application state. */
export function mapAuthUser(user: ApiAuthUser): AuthUser {
  return {
    id: String(user.id), firstName: user.first_name, lastName: user.last_name,
    email: user.email, username: user.username, countryCode: user.country_code,
    mobile: user.mobile ?? undefined, role: user.role,
    avatarUrl: user.avatar_url ?? undefined, coverUrl: user.cover_url,
    createdAt: user.created_at, isVerified: user.is_verified,
    bio: user.bio, gradeLevel: user.grade_level, preferredLanguage: user.preferred_language,
    dob: user.dob, country: user.country, timezone: user.timezone,
    educationLevel: user.education_level, academicYear: user.academic_year,
    selectedInterests: user.selected_interests, onboardingCompleted: user.onboarding_completed,
  };
}
