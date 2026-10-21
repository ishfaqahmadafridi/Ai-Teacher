'use client';
import { memo } from 'react';
import type { TimetableCourseSelectorProps } from '../../types/timetablePreferences.types';

export const TimetableCourseSelector = memo(function TimetableCourseSelector({ courses, selectedIds, onToggle, isLoading, hasError }: TimetableCourseSelectorProps) {
  return <fieldset className="space-y-3"><legend className="text-sm font-semibold">Courses to schedule</legend>
    <p className="text-xs leading-5 text-dashboard-muted">Select saved course plans. Class days and times below schedule their existing weekly topics and quizzes. Completed weeks are excluded.</p>
    {isLoading ? <p role="status" className="text-sm">Loading courses…</p> : hasError ? <p role="alert" className="text-sm text-dashboard-danger">Unable to load courses. Close and try again.</p> : !courses.length ? <p className="text-sm text-dashboard-muted">Register a course and save its study plan first.</p> : courses.map(course => {
      const ready = Boolean(course.outlineTopics?.length && course.outlinePeriod?.duration_months);
      return <label key={course.id} className={`flex items-start gap-3 rounded-xl border border-dashboard-border p-3 text-sm ${ready ? 'cursor-pointer' : 'opacity-60'}`}>
        <input type="checkbox" className="mt-1" disabled={!ready} checked={selectedIds.includes(course.id)} onChange={() => onToggle(course.id)} />
        <span><span className="block font-medium">{course.title} · {course.courseCode}</span><span className="mt-1 block text-xs text-dashboard-muted">{ready ? `${course.outlinePeriod?.duration_months}-month saved plan · ${course.outlineTopics?.length} topics` : 'Set up and save this course’s study plan first.'}</span></span>
      </label>;
    })}
  </fieldset>;
});
TimetableCourseSelector.displayName = 'TimetableCourseSelector';
