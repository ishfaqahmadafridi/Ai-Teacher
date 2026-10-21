'use client';
import { COURSE_OUTLINE_MAX_DETAIL_CHARACTERS } from '../../constants/courseOutlineConstants';
import { memo } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import type { CourseOutlineTopicPlanProps } from '../../types/courses.types';

export const CourseOutlineTopicPlan = memo(function CourseOutlineTopicPlan({ topics, details, sessions, disabled, onUpdate }: CourseOutlineTopicPlanProps) {
  return <section className="space-y-3" aria-label="Topic details and timetable">
    <div><h3 className="text-base font-semibold">What each topic covers</h3>
      <p className="mt-1 text-xs leading-5 text-dashboard-muted">Dates come from your saved timetable. Recurring weekly classes show their current-week occurrence. Exercises below are planned practice, not recorded completion. Keep each topic’s details under {COURSE_OUTLINE_MAX_DETAIL_CHARACTERS.toLocaleString('en-US')} characters. Save changes and regenerate the timetable to use them in lessons.</p></div>
    {topics.map((title, index) => {
      const detail = details.find(item => item.title === title);
      const planned = sessions.filter(item => item.title === title);
      return <details key={`${index}-${title}`} open={index === 0} className="group rounded-xl border border-dashboard-border bg-dashboard-panel">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-4 focus-visible:outline-2 focus-visible:outline-dashboard-primary">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-dashboard-selected text-xs font-semibold text-dashboard-primary">{index + 1}</span>
          <span className="min-w-0 flex-1 break-words text-sm font-semibold">{title}</span>
          <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-dashboard-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-4 border-t border-dashboard-border p-4">
          <div className="space-y-1 text-xs text-dashboard-muted">
            <p className="flex items-center gap-2 font-medium"><CalendarDays aria-hidden="true" className="h-4 w-4" />Planned class</p>
            {planned.length ? planned.map((session, slot) => <p key={slot}>{session.day}, {session.date} · {session.start}–{session.end} ({session.timezone})</p>) : <p>Not scheduled in the saved timetable. Generate or update your timetable after saving.</p>}
          </div>
          <label className="block text-xs font-medium">Subtopics — one per line
            <textarea value={detail?.subtopics.join('\n') ?? ''} onChange={event => onUpdate(title, 'subtopics', event.target.value)} disabled={disabled} rows={3} placeholder="Add the concepts included in this topic" className="mt-2 w-full rounded-lg border border-dashboard-border bg-dashboard-panel p-3 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-dashboard-primary disabled:opacity-60" />
          </label>
          <label className="block text-xs font-medium">Practice exercises — one per line
            <textarea value={detail?.exercises.join('\n') ?? ''} onChange={event => onUpdate(title, 'exercises', event.target.value)} disabled={disabled} rows={3} placeholder="Add exercises or practical tasks for this topic" className="mt-2 w-full rounded-lg border border-dashboard-border bg-dashboard-panel p-3 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-dashboard-primary disabled:opacity-60" />
          </label>
        </div>
      </details>;
    })}
  </section>;
});
CourseOutlineTopicPlan.displayName = 'CourseOutlineTopicPlan';
