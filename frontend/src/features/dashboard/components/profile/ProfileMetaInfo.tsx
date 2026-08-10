'use client';

import { memo } from 'react';
import { CheckCircle2, Mail, Phone, IdCard, GraduationCap } from 'lucide-react';
import type { ProfileMetaInfoProps } from '../../types/profile.types';

export const ProfileMetaInfo = memo(function ProfileMetaInfo({
  name,
  email,
  phone,
  studentId,
  gradeLevel,
  className = '',
}: ProfileMetaInfoProps) {
  return (
    <div className={`text-center sm:text-left flex-1 min-w-0 pt-3 sm:pt-4 ${className}`}>
      {/* Student Name */}
      <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {name}
        </h2>
        <CheckCircle2 className="w-5.5 h-5.5 text-[#38BDF8] shrink-0" />
      </div>

      {/* Email & Phone Number Info Row */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm font-['Hanken_Grotesk',sans-serif] mb-3">
        <div className="flex items-center gap-2 text-[#CBD5E1] bg-[#1E293B] px-3 py-1.5 rounded-xl border border-[#334155]">
          <Mail className="w-4 h-4 text-[#38BDF8]" />
          <span>{email}</span>
        </div>
        <div className="flex items-center gap-2 text-[#CBD5E1] bg-[#1E293B] px-3 py-1.5 rounded-xl border border-[#334155]">
          <Phone className="w-4 h-4 text-[#38BDF8]" />
          <span>{phone}</span>
        </div>
      </div>

      {/* Student ID & Program Pill Badges */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
        <span className="text-xs px-3 py-1 rounded-full bg-[#1E293B] text-[#38BDF8] font-mono border border-[#334155] flex items-center gap-1.5">
          <IdCard className="w-3.5 h-3.5 text-[#38BDF8]" />
          {studentId}
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-[#2563EB]/20 text-[#60A5FA] font-medium border border-[#2563EB]/30 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-[#60A5FA]" />
          {gradeLevel}
        </span>
      </div>
    </div>
  );
});

ProfileMetaInfo.displayName = 'ProfileMetaInfo';
