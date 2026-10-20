'use client';

import Link from 'next/link';
import { useLearningSetupActions } from '../../hooks/useLearningSetupActions';
import { TimezoneSelect } from '@/features/onboarding/components/Step3Profile/TimezoneSelect';
import type { LearningSetupActionsProps } from '../../types/dashboard.types';

export function LearningSetupActions({ onRegisterCourse, onOpenTimetable }: LearningSetupActionsProps) {
  const { isReady, missing, needsTimezone, timezone, setTimezone, saveTimezone, saveError, isSaving } = useLearningSetupActions();
  const buttonClass = 'inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-dashboard-text hover:bg-blue-500 disabled:bg-dashboard-subtle disabled:text-slate-500 disabled:cursor-not-allowed';

  return (
    <section className="mb-8 space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Your learning setup</h2>
        <p className="mt-2 text-dashboard-muted">Finish skipped details or update your choices here, then register courses and plan your timetable.</p>
        {isReady && <p role="status" className="mt-2 text-sm text-emerald-400">Your learning profile is saved. Next, register a course or open the timetable planner below.</p>}
        {!isReady && <p className="mt-2 text-sm text-amber-300">Still needed: {missing.join(', ')}.</p>}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-dashboard-border bg-dashboard-subtle p-5 space-y-3">
          <h3 className="font-semibold">1. Complete your profile</h3>
          <p className="text-sm text-dashboard-muted">Add your country, timezone, language, education, academic year, and one field of study.</p>
          <Link href="/onboarding/step-3" className={buttonClass}>{isReady ? 'Edit learning details' : 'Complete learning details'}</Link>
          {needsTimezone && (
            <div className="space-y-3 border-t border-dashboard-border pt-3">
              <TimezoneSelect value={timezone} onChange={setTimezone} />
              <button type="button" disabled={!timezone || isSaving} onClick={() => void saveTimezone()} className={buttonClass}>{isSaving ? 'Saving…' : 'Save timezone'}</button>
              {saveError && <p role="alert" className="text-sm text-red-400">{saveError}</p>}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-dashboard-border bg-dashboard-subtle p-5 space-y-3">
          <h3 className="font-semibold">2. Register your courses</h3>
          <p className="text-sm text-dashboard-muted">Choose a saved learning interest and enter your course title, code, and credit hours. Courses are added when you submit.</p>
          <button type="button" disabled={!isReady} onClick={onRegisterCourse} className={buttonClass}>Register a course</button>
          {!isReady && <p className="text-xs text-dashboard-muted">Complete your learning details first.</p>}
        </div>
        <div className="rounded-2xl border border-dashboard-border bg-dashboard-subtle p-5 space-y-3">
          <h3 className="font-semibold">3. Create your timetable</h3>
          <p className="text-sm text-dashboard-muted">Open Class Schedule and choose AI Smart Planner to set your study times, or Manual Create to add a slot.</p>
          <button type="button" disabled={!isReady} onClick={onOpenTimetable} className={buttonClass}>Open timetable planner</button>
          {!isReady && <p className="text-xs text-dashboard-muted">Complete your learning details first.</p>}
        </div>
      </div>
    </section>
  );
}
