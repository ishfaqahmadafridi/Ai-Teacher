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
  isVerified = false,
  className = '',
}: ProfileMetaInfoProps) {
  return (
    <div className={`text-center sm:text-left flex-1 min-w-0 pt-3 sm:pt-4 ${className}`}>
      {/* Student Name */}
      <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-dashboard-text tracking-tight">
          {name}
        </h2>
        {isVerified && <CheckCircle2 className="w-5.5 h-5.5 text-dashboard-primary shrink-0" />}
      </div>

      {/* Email & Phone Number Info Row */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm font-['Hanken_Grotesk',sans-serif] mb-3">
        <div className="flex items-center gap-2 text-dashboard-muted bg-dashboard-subtle px-3 py-1.5 rounded-xl border border-dashboard-border">
          <Mail className="w-4 h-4 text-dashboard-primary" />
          <span>{email}</span>
        </div>
        <div className="flex items-center gap-2 text-dashboard-muted bg-dashboard-subtle px-3 py-1.5 rounded-xl border border-dashboard-border">
          <Phone className="w-4 h-4 text-dashboard-primary" />
          <span>{phone}</span>
        </div>
      </div>

      {/* Student ID & Program Pill Badges */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
        <span className="text-xs px-3 py-1 rounded-full bg-dashboard-subtle text-dashboard-primary font-mono border border-dashboard-border flex items-center gap-1.5">
          <IdCard className="w-3.5 h-3.5 text-dashboard-primary" />
          {studentId}
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-dashboard-primary/20 text-dashboard-primary font-medium border border-dashboard-primary/30 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-dashboard-primary" />
          {gradeLevel}
        </span>
      </div>
    </div>
  );
});

ProfileMetaInfo.displayName = 'ProfileMetaInfo';
