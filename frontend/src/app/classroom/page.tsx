'use client';

import { ClassroomLayout } from '@/features/classroom/components/ClassroomLayout';
import { useAuthStore } from '@/features/auth/state/authStore';
import { getLearningReadiness } from '@/features/onboarding/utils/learningReadiness';
import { LearningSetupPrompt } from '@/features/onboarding/components/LearningSetupPrompt';

export default function ClassroomPage() {
  const user = useAuthStore((state) => state.user);
  if (!getLearningReadiness(user).isReady) {
    return <main className="min-h-screen bg-slate-950 p-6 flex items-center justify-center"><LearningSetupPrompt /></main>;
  }
  return <ClassroomLayout />;
}
