'use client';

import { memo } from 'react';
import { User, IdCard } from 'lucide-react';
import type { ProfileIdentityFieldsProps } from '../../types/profile.types';

export const ProfileIdentityFields = memo(function ProfileIdentityFields({
  name,
  studentId,
  onChange,
  className = '',
}: ProfileIdentityFieldsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      <div>
        <label
          htmlFor="profile-fullname"
          className="block text-xs font-semibold text-dashboard-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
        >
          <User className="w-3.5 h-3.5 text-dashboard-primary" /> Full Name
        </label>
        <input
          id="profile-fullname"
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          required
          className="w-full bg-dashboard-subtle border border-dashboard-border rounded-xl px-3.5 py-2.5 text-sm text-dashboard-text focus:outline-none focus:border-dashboard-primary transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="profile-studentid"
          className="block text-xs font-semibold text-dashboard-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
        >
          <IdCard className="w-3.5 h-3.5 text-dashboard-primary" /> Student ID
        </label>
        <input
          id="profile-studentid"
          type="text"
          name="studentId"
          value={studentId}
          onChange={onChange}
          readOnly
          className="w-full bg-dashboard-subtle/50 border border-dashboard-border rounded-xl px-3.5 py-2.5 text-sm text-dashboard-muted cursor-not-allowed font-mono"
        />
      </div>
    </div>
  );
});

ProfileIdentityFields.displayName = 'ProfileIdentityFields';
