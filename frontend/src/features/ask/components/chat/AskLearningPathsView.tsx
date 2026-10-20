'use client';

import { memo } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import type { AskLearningPathsViewProps } from '../../types/ask.types';

export const AskLearningPathsView = memo(function AskLearningPathsView({ courses, isLoading, error }: AskLearningPathsViewProps) {
  return (
    <main className="flex-1 overflow-y-auto px-5 pt-28 pb-10">
      <div className="mx-auto max-w-[48rem]">
        <h1 className="text-2xl font-semibold tracking-tight">Learning paths</h1>
        <p className="mt-2 text-sm text-dashboard-muted">Follow your registered courses and track your progress.</p>
        {isLoading && <p role="status" className="mt-6 text-dashboard-muted">Loading your courses…</p>}
        {error && <p role="alert" className="mt-6 text-dashboard-danger">Your courses could not be loaded. Please try again.</p>}
        {!isLoading && !error && !courses.length && <p className="mt-7 rounded-2xl border border-dashboard-border bg-dashboard-panel p-6 text-sm text-dashboard-muted">No courses registered yet. Open your dashboard to add a course.</p>}
        <div className="mt-7 space-y-3">
          {courses.map((course) => (
            <article key={course.id} className="rounded-2xl border border-dashboard-border bg-dashboard-panel p-5">
              <div className="flex items-center gap-3"><BookOpen aria-hidden="true" size={20} className="shrink-0 text-dashboard-muted" /><h2 className="font-semibold">{course.title}</h2></div>
              <p className="mt-2 text-sm text-dashboard-muted">{course.courseCode} · {course.subjectField}</p>
              <div className="mt-4 flex items-center gap-4"><progress aria-label={`${course.title} completion`} max={100} value={course.progressPercent} className="h-2 flex-1 accent-dashboard-primary" /><span className="text-sm tabular-nums text-dashboard-muted">{course.progressPercent}%</span></div>
            </article>
          ))}
        </div>
        <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-dashboard-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-dashboard-primary-hover no-underline">Open dashboard <ArrowRight aria-hidden="true" size={16} /></Link>
      </div>
    </main>
  );
});

AskLearningPathsView.displayName = 'AskLearningPathsView';
