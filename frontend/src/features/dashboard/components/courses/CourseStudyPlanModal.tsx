'use client';
import { memo } from 'react';
import { X } from 'lucide-react';
import { DashboardDialog } from '../modals/DashboardDialog';
import { CourseOutlineWeeks } from './CourseOutlineWeeks';
import { useCourseStudyPlan } from '../../hooks/useCourseStudyPlan';
import type { CourseStudyPlanModalProps } from '../../types/courses.types';

export const CourseStudyPlanModal = memo(function CourseStudyPlanModal(props: CourseStudyPlanModalProps) {
  const { courseId, setCourseId, course, outline, isLoading, error } = useCourseStudyPlan(props);
  return <DashboardDialog title="Course study plan" onClose={props.onClose} className="max-w-[64rem] p-5 sm:p-7">
    <header className="mb-5 flex items-start justify-between gap-4">
      <div><h2 className="text-xl font-bold">{course?.title ?? 'Course study plan'}</h2><p className="mt-1 text-sm text-dashboard-muted">{course?.courseCode} · Course outline and planned weekly work</p></div>
      <button type="button" onClick={props.onClose} aria-label="Close course study plan" className="dashboard-button dashboard-button-secondary p-2"><X className="h-4 w-4" /></button>
    </header>
    {props.courses.length > 1 && <label className="mb-5 block text-sm font-medium">Course<select value={courseId} onChange={event => setCourseId(event.target.value)} className="mt-2 block w-full rounded-lg border border-dashboard-border bg-dashboard-panel p-3">{props.courses.map(item => <option key={item.id} value={item.id}>{item.title} · {item.courseCode}</option>)}</select></label>}
    {isLoading ? <p role="status">Loading course plan…</p> : error ? <p role="alert" className="text-dashboard-danger">Unable to load this course plan. Close and try again.</p> : <>
      {outline?.period && <p className="mb-5 rounded-xl border border-dashboard-border bg-dashboard-subtle p-4 text-sm"><strong>Selected plan: {outline.period.duration_months} months</strong><span className="ms-2 text-dashboard-muted">{outline.weeks?.length ?? 0} weeks</span></p>}
      {outline?.weeks?.length ? <CourseOutlineWeeks weeks={outline.weeks} /> : <p className="rounded-xl border border-dashboard-border p-4 text-sm text-dashboard-muted">No weekly course plan saved yet. Open this course’s outline, choose its duration, add or generate topics, then select Save outline.</p>}
    </>}
  </DashboardDialog>;
});
CourseStudyPlanModal.displayName = 'CourseStudyPlanModal';
