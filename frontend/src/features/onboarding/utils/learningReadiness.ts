import type { AuthUser } from '@/features/auth/types';

export function getLearningReadiness(user: AuthUser | null) {
  const missing: string[] = [];
  if (!user?.firstName.trim()) missing.push('Full name');
  if (!user?.country.trim()) missing.push('Country');
  if (!user?.timezone.trim()) missing.push('Timezone');
  if (!user?.preferredLanguage.trim()) missing.push('Preferred language');
  if (!user?.educationLevel.trim()) missing.push('Education level');
  if (!user?.academicYear.trim()) missing.push('Academic year');
  if (!user?.selectedInterests.some((interest) => interest.trim())) missing.push('Learning interests');
  else if (user.selectedInterests.length !== 1) missing.push('Choose one field of study');
  return { isReady: missing.length === 0, missing };
}
