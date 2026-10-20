'use client';

import { Tag, BookOpen } from 'lucide-react';
import type { ScheduleSlotFieldsProps } from '../../types/schedule.types';

export function ScheduleTopicFields({ model }: ScheduleSlotFieldsProps) {
  const { title, setTitle, subject, setSubject, subjectOptions } = model;
  return (
    <>
            {/* 1. Class Topic / Title */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-dashboard-muted uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-dashboard-muted" />
                Session Topic / Class Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mechanics & Wave Dynamics"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dashboard-subtle/80 border border-dashboard-border/80 text-dashboard-text text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* 2. Course / Subject */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-dashboard-muted uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-dashboard-muted" />
                Course / Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dashboard-subtle/80 border border-dashboard-border/80 text-dashboard-text text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option value="">Choose a registered course</option>
                {subjectOptions.map((subj) => (
                  <option key={subj} value={subj} className="bg-dashboard-subtle text-dashboard-text">
                    {subj}
                  </option>
                ))}
              </select>
            </div>

    </>
  );
}
