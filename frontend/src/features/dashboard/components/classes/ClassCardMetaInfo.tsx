'use client';

import { memo } from 'react';
import { Clock, Users } from 'lucide-react';
import type { ClassCardMetaInfoProps } from '../../types/classes.types';

export const ClassCardMetaInfo = memo(function ClassCardMetaInfo({
  timeFormatted,
  attendanceCount,
}: ClassCardMetaInfoProps) {
  return (
    <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-3">
      <div className="flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-[#94A3B8]" aria-hidden="true" />
        <span>{timeFormatted}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Users className="w-4 h-4 text-[#94A3B8]" aria-hidden="true" />
        <span>{attendanceCount} Enrolled</span>
      </div>
    </div>
  );
});

ClassCardMetaInfo.displayName = 'ClassCardMetaInfo';
