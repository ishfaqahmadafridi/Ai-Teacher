'use client';

import { memo } from 'react';
import { calculateClassCardMetrics } from '../../utilities/classUtils';
import { ClassCardHeader } from './ClassCardHeader';
import { ClassCardMetaInfo } from './ClassCardMetaInfo';
import { ClassCardProgressBar } from './ClassCardProgressBar';
import { ClassCardActionButton } from './ClassCardActionButton';
import type { ClassCardProps } from '../../types/classes.types';

export const ClassCard = memo(function ClassCard({
  classItem,
  onJoinClass,
  className = '',
}: ClassCardProps) {
  const metrics = calculateClassCardMetrics(classItem);

  return (
    <div
      className={`bg-dashboard-panel/90 backdrop-blur-md rounded-2xl p-5 shadow-none border border-dashboard-border flex flex-col justify-between hover:border-dashboard-primary/40 transition-all duration-300 group font-['Hanken_Grotesk',sans-serif] space-y-4 ${className}`}
    >
      <div>
        {/* Top Header: Subject & Live Status */}
        <ClassCardHeader subject={classItem.subject} isLive={classItem.isLive} />

        {/* Class Title */}
        <h3 className="font-['Hanken_Grotesk',sans-serif] text-base font-bold text-dashboard-text mb-2 group-hover:text-dashboard-primary transition-colors leading-snug">
          {classItem.title}
        </h3>

        {/* Time & Attendance Info */}
        <ClassCardMetaInfo
          timeFormatted={classItem.timeFormatted}
          attendanceCount={classItem.attendanceCount}
        />

        {/* Schedule Progress Bar */}
        <ClassCardProgressBar
          metrics={metrics}
          timeRemaining={classItem.timeRemaining}
        />
      </div>

      {/* Bottom Action Button */}
      <ClassCardActionButton classItem={classItem} onJoinClass={onJoinClass} />
    </div>
  );
});

ClassCard.displayName = 'ClassCard';
