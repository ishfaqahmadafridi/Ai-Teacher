'use client';

import { memo } from 'react';
import { BookOpen } from 'lucide-react';
import type { RegisterCourseTitleInputProps } from '../../types/courses.types';

export const RegisterCourseTitleInput = memo(function RegisterCourseTitleInput({
  title,
  onChange,
  className = '',
}: RegisterCourseTitleInputProps) {
  return (
    <div className={className}>
      <label
        htmlFor="reg-course-title"
        className="block text-xs font-semibold text-dashboard-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
      >
        <BookOpen className="w-3.5 h-3.5 text-dashboard-primary" /> Course Name / Title
      </label>
      <input
        id="reg-course-title"
        type="text"
        name="title"
        value={title}
        onChange={onChange}
        placeholder="e.g., Computer Science & Software Engineering"
        required
        className="w-full bg-dashboard-subtle border border-dashboard-border rounded-xl px-3.5 py-2.5 text-sm text-dashboard-text focus:outline-none focus:border-dashboard-primary transition-colors"
      />
    </div>
  );
});

RegisterCourseTitleInput.displayName = 'RegisterCourseTitleInput';
