'use client';

import Link from 'next/link';
import { useAuthStore } from '@/features/auth/state/authStore';
import { getLearningReadiness } from '../utils/learningReadiness';

export function LearningSetupPrompt() {
  const user = useAuthStore((state) => state.user);
  const { missing } = getLearningReadiness(user);

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white space-y-4">
      <h2 className="text-xl font-semibold">Complete your learning profile</h2>
      <p>You can finish the details you skipped whenever you are ready. Timetable planning and classroom access become available after you save your learning details.</p>
      {missing.length > 0 && <p className="text-slate-300">Still needed: {missing.join(', ')}.</p>}
      <Link href="/onboarding/step-3" className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500">Complete learning details</Link>
    </section>
  );
}
