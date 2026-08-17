'use client';

import { memo } from 'react';
import { Mail, Phone } from 'lucide-react';
import type { ProfileContactFieldsProps } from '../../types/profile.types';

export const ProfileContactFields = memo(function ProfileContactFields({
  email,
  phone,
  onChange,
  className = '',
}: ProfileContactFieldsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      <div>
        <label
          htmlFor="profile-email"
          className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
        >
          <Mail className="w-3.5 h-3.5 text-[#38BDF8]" /> Email Address
        </label>
        <input
          id="profile-email"
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          required
          className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="profile-phone"
          className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-[#38BDF8]" /> Phone Number
        </label>
        <input
          id="profile-phone"
          type="tel"
          name="phone"
          value={phone}
          onChange={onChange}
          required
          className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
        />
      </div>
    </div>
  );
});

ProfileContactFields.displayName = 'ProfileContactFields';
