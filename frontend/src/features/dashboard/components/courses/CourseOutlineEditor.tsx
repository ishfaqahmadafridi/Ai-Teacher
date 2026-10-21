'use client';
import { memo } from 'react';
import { BookOpen, CheckCircle2, ListOrdered, LoaderCircle, Sparkles, X } from 'lucide-react';
import { COURSE_OUTLINE_MAX_TOPICS } from '../../constants/courseOutlineConstants';
import { CourseOutlineTopicPlan } from './CourseOutlineTopicPlan';
import { useCourseOutline } from '../../hooks/useCourseOutline';
import type { CourseOutlineEditorProps } from '../../types/courses.types';

export const CourseOutlineEditor = memo(function CourseOutlineEditor({ course, onClose }: CourseOutlineEditorProps) {
  const { text, source, busy, error, saved, details, sessions, topics, educationLevel, academicYear, gradeLevel, updateDetail, updateText, useManual, generate, save } = useCourseOutline(course);
  return <div className="space-y-6 p-5 sm:p-7">
    <header className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <BookOpen aria-hidden="true" className="h-10 w-10 shrink-0 rounded-xl bg-dashboard-selected p-2 text-dashboard-primary" />
        <div><h2 className="text-xl font-bold">Course outline</h2><p className="mt-1 text-sm text-dashboard-muted">{course.title} · {course.courseCode}</p></div>
      </div>
      <button type="button" onClick={onClose} aria-label="Close course outline" className="dashboard-button dashboard-button-secondary p-2"><X className="h-4 w-4" /></button>
    </header>
    <p className="text-sm leading-6 text-dashboard-muted">Use your own syllabus or start with an AI draft. Review the topics, arrange them in learning order, and save your outline.</p>
    <div className="rounded-xl border border-dashboard-border bg-dashboard-subtle p-3 text-sm" role="status">
      <p className="font-medium">Student level: <span className="capitalize">{educationLevel || 'Not set'}</span>{academicYear && ` · ${academicYear}`}{gradeLevel && ` · ${gradeLevel}`}</p>
      <p className="mt-1 text-xs leading-5 text-dashboard-muted">{educationLevel ? 'AI will use this saved profile level for topic depth, vocabulary, subtopics and exercises. Check it in profile settings before generating.' : 'Set your education level in profile settings before using AI. You can still enter your own syllabus.'}</p>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      <button type="button" disabled={!!busy} aria-pressed={source === 'manual'} onClick={useManual} className={`rounded-xl border p-4 text-left transition-colors disabled:opacity-50 ${source === 'manual' ? 'border-dashboard-primary bg-dashboard-selected' : 'border-dashboard-border hover:bg-dashboard-subtle'}`}>
        <ListOrdered className="mb-2 h-5 w-5 text-dashboard-primary" aria-hidden="true" /><span className="block text-sm font-semibold">Enter my outline</span><span className="mt-1 block text-xs leading-5 text-dashboard-muted">Type or paste topics from your syllabus.</span>
      </button>
      <button type="button" disabled={!!busy} onClick={generate} className={`rounded-xl border p-4 text-left transition-colors disabled:opacity-50 ${source === 'ai' ? 'border-dashboard-primary bg-dashboard-selected' : 'border-dashboard-border hover:bg-dashboard-subtle'}`}>
        <Sparkles className="mb-2 h-5 w-5 text-dashboard-primary" aria-hidden="true" /><span className="block text-sm font-semibold">{busy === 'generating' ? 'Creating your draft…' : 'Generate with AI'}</span><span className="mt-1 block text-xs leading-5 text-dashboard-muted">Create an editable draft for this course.</span>
      </button>
    </div>
    {busy === 'loading' ? <p role="status" className="text-sm text-dashboard-muted">Loading course outline…</p> : <div className="space-y-2">
      <label htmlFor={`outline-${course.id}`} className="block text-sm font-semibold">Main topics in learning order</label>
      <textarea id={`outline-${course.id}`} value={text} onChange={event => updateText(event.target.value)} disabled={!!busy} rows={4} aria-describedby={`outline-help-${course.id}`} placeholder="Enter one topic per line" className="w-full resize-y rounded-xl border border-dashboard-border bg-dashboard-panel p-4 text-sm leading-7 text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-primary disabled:opacity-60" />
      <p id={`outline-help-${course.id}`} className="text-xs leading-5 text-dashboard-muted">One topic per line, up to {COURSE_OUTLINE_MAX_TOPICS} topics. AI drafts are suggestions; edit them to match your syllabus. Generating a new draft replaces the text above.</p>
    </div>}
    {!busy && topics.length > 0 && <CourseOutlineTopicPlan topics={topics} details={details} sessions={sessions} disabled={!!busy} onUpdate={updateDetail} />}
    {error && <p role="alert" className="rounded-xl border border-dashboard-danger/25 bg-dashboard-danger/5 p-3 text-sm text-dashboard-danger">{error}</p>}
    {saved && <p role="status" className="flex items-start gap-2 rounded-xl bg-dashboard-success/10 p-3 text-sm text-dashboard-success"><CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />Outline saved. New schedules will follow these topics. Regenerate your timetable to apply it to scheduled lessons.</p>}
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-dashboard-border pt-4">
      <button type="button" onClick={onClose} className="dashboard-button dashboard-button-secondary">{saved ? 'Done' : 'Set up later'}</button>
      <button type="button" onClick={save} disabled={!!busy || !text.trim() || saved} className="dashboard-button dashboard-button-primary">{busy === 'saving' && <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />}{busy === 'saving' ? 'Saving…' : 'Save outline'}</button>
    </footer>
  </div>;
});
CourseOutlineEditor.displayName = 'CourseOutlineEditor';
