'use client';

import { memo } from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';
import type { ProfileAcademicFieldsProps } from '../../types/profile.types';

export const ProfileAcademicFields = memo(function ProfileAcademicFields({
  gradeLevel,
  bio,
  onChange,
  className = '',
}: ProfileAcademicFieldsProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Grade Level / Course */}
      <div>
        <label
          htmlFor="profile-grade"
          className="block text-xs font-semibold text-dashboard-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
        >
          <GraduationCap className="w-3.5 h-3.5 text-dashboard-primary" /> Current Program / Grade
        </label>
        <input
          id="profile-grade"
          type="text"
          name="gradeLevel"
          value={gradeLevel}
          onChange={onChange}
          className="w-full bg-dashboard-subtle border border-dashboard-border rounded-xl px-3.5 py-2.5 text-sm text-dashboard-text focus:outline-none focus:border-dashboard-primary transition-colors"
        />
      </div>

      {/* Bio / Learning Goal */}
      <div>
        <label
          htmlFor="profile-bio"
          className="block text-xs font-semibold text-dashboard-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-dashboard-primary" /> Learning Bio & Goals
        </label>
        <textarea
          id="profile-bio"
          name="bio"
          rows={3}
          value={bio || ''}
          onChange={onChange}
          placeholder="Share your learning interests or physics goals..."
          className="w-full bg-dashboard-subtle border border-dashboard-border rounded-xl px-3.5 py-2.5 text-sm text-dashboard-text focus:outline-none focus:border-dashboard-primary transition-colors resize-none"
        />
      </div>
    </div>
  );
});

ProfileAcademicFields.displayName = 'ProfileAcademicFields';
