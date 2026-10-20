'use client';

import { memo } from 'react';
import { CalendarCheck2, Download } from 'lucide-react';
import type { AttendanceReportHeaderProps } from '../../types/progress.types';

export const AttendanceReportHeader = memo(function AttendanceReportHeader({ onDownloadClick }: AttendanceReportHeaderProps) {
  return (
    <>
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashboard-border pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dashboard-subtle text-dashboard-muted text-xs font-bold uppercase tracking-wider mb-2 border border-dashboard-border">
            <CalendarCheck2 className="w-4 h-4 text-dashboard-muted" />
            <span>Attendance & Absence Report</span>
          </div>
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-dashboard-text">
            Class Attendance History & Missed Sessions
          </h3>
        </div>

        {/* Download CSV Button */}
        <button
          type="button"
          onClick={onDownloadClick}
          className="dashboard-button dashboard-button-secondary shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Full Report (.CSV)</span>
        </button>
      </div>


    </>
  );
});

AttendanceReportHeader.displayName = 'AttendanceReportHeader';
