'use client';

import { memo } from 'react';
import { CalendarCheck2, Download } from 'lucide-react';
import type { AttendanceReportHeaderProps } from '../../types/progress.types';

export const AttendanceReportHeader = memo(function AttendanceReportHeader({ onDownloadClick }: AttendanceReportHeaderProps) {
  return (
    <>
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-bold uppercase tracking-wider mb-2 border border-[#10B981]/30">
            <CalendarCheck2 className="w-4 h-4 text-[#10B981]" />
            <span>Attendance & Absence Report</span>
          </div>
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-white">
            Class Attendance History & Missed Sessions
          </h3>
        </div>

        {/* Download CSV Button */}
        <button
          type="button"
          onClick={onDownloadClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-lg shadow-[#2563EB]/25 transition-all duration-200 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Full Report (.CSV)</span>
        </button>
      </div>


    </>
  );
});

AttendanceReportHeader.displayName = 'AttendanceReportHeader';
