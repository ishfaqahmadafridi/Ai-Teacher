'use client';
import { memo } from 'react';
import { BookOpen, CheckCircle2, ListOrdered, LoaderCircle, Sparkles, X } from 'lucide-react';
import { COURSE_OUTLINE_MAX_TOPICS } from '../../constants/courseOutlineConstants';
import { StudyPlanPeriodFields } from '../schedule/StudyPlanPeriodFields';
import { CourseStudyPlanModal } from './CourseStudyPlanModal';
import { CourseOutlineWeeks } from './CourseOutlineWeeks';
import { CourseOutlineTopicPlan } from './CourseOutlineTopicPlan';
import { useCourseOutline } from '../../hooks/useCourseOutline';
import type { CourseOutlineEditorProps } from '../../types/courses.types';

export const CourseOutlineEditor = memo(function CourseOutlineEditor({ course, onClose }: CourseOutlineEditorProps) {
  const { isStudyPlanOpen, openStudyPlan, closeStudyPlan, startDate, durationMonths, weeks, updateStartDate, updateDurationMonths, text, source, busy, error, saved, details, sessions, topics, educationLevel, academicYear, gradeLevel, updateDetail, updateText, useManual, generate, save } = useCourseOutline(course);
  return <div className="space-y-6 p-5 sm:p-7">
    {isStudyPlanOpen && <CourseStudyPlanModal courses={[course]} onClose={closeStudyPlan} />}
    <header className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <BookOpen aria-hidden="true" className="h-10 w-10 shrink-0 rounded-xl bg-dashboard-selected p-2 text-dashboard-primary" />
        <div><h2 className="text-xl font-bold">Course outline</h2><p className="mt-1 text-sm text-dashboard-muted">{course.title} · {course.courseCode}</p></div>
      </div>
      <button type="button" onClick={onClose} aria-label="Close course outline" className="dashboard-button dashboard-button-secondary p-2"><X className="h-4 w-4" /></button>
    </header>
    <p className="text-sm leading-6 text-dashboard-muted">Use your own syllabus or start with an AI draft. Choose a study period, then generate a draft or enter your topics. Review what to study each week and save the outline. Classroom times are arranged separately in Class Schedule.</p>
    <div className="rounded-xl border border-dashboard-border bg-dashboard-subtle p-3 text-sm" role="status">
      <p className="font-medium">Student level: <span className="capitalize">{educationLevel || 'Not set'}</span>{academicYear && ` · ${academicYear}`}{gradeLevel && ` · ${gradeLevel}`}</p>
      <p className="mt-1 text-xs leading-5 text-dashboard-muted">{educationLevel ? 'AI will use this saved profile level for topic depth, vocabulary, subtopics and exercises. Check it in profile settings before generating.' : 'Set your education level in profile settings before using AI. You can still enter your own syllabus.'}</p>
    </div>
    <StudyPlanPeriodFields disabled={!!busy} startDate={startDate} durationMonths={durationMonths} onStartDateChange={updateStartDate} onDurationChange={updateDurationMonths} description="Choose the duration before generating. The outline divides this course into dated weeks with topics, subtopics, exercises and review." />
    <div className="grid gap-3 sm:grid-cols-2">
      <button type="button" disabled={!!busy} aria-pressed={source === 'manual'} onClick={useManual} className={`rounded-xl border p-4 text-left transition-colors disabled:opacity-50 ${source === 'manual' ? 'border-dashboard-primary bg-dashboard-selected' : 'border-dashboard-border hover:bg-dashboard-subtle'}`}>
        <ListOrdered className="mb-2 h-5 w-5 text-dashboard-primary" aria-hidden="true" /><span className="block text-sm font-semibold">Enter my outline</span><span className="mt-1 block text-xs leading-5 text-dashboard-muted">Type or paste topics from your syllabus.</span>
      </button>
      <button type="button" disabled={!!busy} onClick={generate} className={`rounded-xl border p-4 text-left transition-colors disabled:opacity-50 ${source === 'ai' ? 'border-dashboard-primary bg-dashboard-selected' : 'border-dashboard-border hover:bg-dashboard-subtle'}`}>
        <Sparkles className="mb-2 h-5 w-5 text-dashboard-primary" aria-hidden="true" /><span className="block text-sm font-semibold">{busy === 'generating' ? 'Creating your draft…' : 'Generate with AI'}</span><span className="mt-1 block text-xs leading-5 text-dashboard-muted">Create an editable draft for this course.</span>
      </button>
    </div>
    {weeks.length > 0 ? <CourseOutlineWeeks weeks={weeks} /> : !busy && topics.length > 0 ? <p role="status" className="text-sm text-dashboard-muted">Save this outline to build its weekly course plan for the selected duration.</p> : null}
    {busy === 'loading' ? <p role="status" className="text-sm text-dashboard-muted">Loading course outline…</p> : <div className="space-y-2">
      <label htmlFor={`outline-${course.id}`} className="block text-sm font-semibold">Main topics in learning order</label>
      <textarea id={`outline-${course.id}`} value={text} onChange={event => updateText(event.target.value)} disabled={!!busy} rows={4} aria-describedby={`outline-help-${course.id}`} placeholder="Enter one topic per line" className="w-full resize-y rounded-xl border border-dashboard-border bg-dashboard-panel p-4 text-sm leading-7 text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-primary disabled:opacity-60" />
      <p id={`outline-help-${course.id}`} className="text-xs leading-5 text-dashboard-muted">One topic per line, up to {COURSE_OUTLINE_MAX_TOPICS} topics. AI drafts are suggestions; edit them to match your syllabus. Generating a new draft replaces the text above.</p>
    </div>}
    {!busy && topics.length > 0 && <CourseOutlineTopicPlan topics={topics} details={details} sessions={sessions} disabled={!!busy} onUpdate={updateDetail} />}
    {error && <p role="alert" className="rounded-xl border border-dashboard-danger/25 bg-dashboard-danger/5 p-3 text-sm text-dashboard-danger">{error}</p>}
    {saved && <p role="status" className="flex items-start gap-2 rounded-xl bg-dashboard-success/10 p-3 text-sm text-dashboard-success"><CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />Outline saved. Your weekly course plan is stored here. Open Class Schedule separately to arrange classroom dates and times.</p>}
    <footer className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-dashboard-border bg-dashboard-panel py-4">
      <button type="button" onClick={onClose} className="dashboard-button dashboard-button-secondary">{saved ? 'Done' : 'Set up later'}</button>
      <div className="space-y-1"><button type="button" onClick={openStudyPlan} disabled={!saved || !!busy} className="dashboard-button dashboard-button-secondary">View study plan</button>{!saved && <p className="text-xs text-dashboard-muted">Save your outline first to view its weekly plan.</p>}</div>
      <button type="button" onClick={save} disabled={!!busy || !text.trim() || saved} className="dashboard-button dashboard-button-primary">{busy === 'saving' && <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />}{busy === 'saving' ? 'Saving…' : saved ? 'Saved' : 'Save outline'}</button>
    </footer>
  </div>;
});
CourseOutlineEditor.displayName = 'CourseOutlineEditor';
