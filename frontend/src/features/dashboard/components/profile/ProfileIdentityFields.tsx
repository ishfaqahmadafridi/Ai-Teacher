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
          className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
        >
          <User className="w-3.5 h-3.5 text-[#38BDF8]" /> Full Name
        </label>
        <input
          id="profile-fullname"
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          required
          className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="profile-studentid"
          className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
        >
          <IdCard className="w-3.5 h-3.5 text-[#38BDF8]" /> Student ID
        </label>
        <input
          id="profile-studentid"
          type="text"
          name="studentId"
          value={studentId}
          onChange={onChange}
          readOnly
          className="w-full bg-[#1E293B]/50 border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-[#94A3B8] cursor-not-allowed font-mono"
        />
      </div>
    </div>
  );
});

ProfileIdentityFields.displayName = 'ProfileIdentityFields';
