'use client';

import { memo } from 'react';
import { FileCode, FileSpreadsheet } from 'lucide-react';
import type { NoteDownloadActionCardProps } from '../../../types/sidebar.types';

export const NoteDownloadActionCard = memo(function NoteDownloadActionCard({
  title,
  activeLangLabel,
  onDownloadPdf,
  onDownloadDocx,
  className = '',
}: NoteDownloadActionCardProps) {
  return (
    <div
      className={`p-3.5 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#0B132B] to-[#0F172A] border border-slate-800/90 flex items-center justify-between gap-3 shadow-md ${className}`}
    >
      <div className="min-w-0 flex-1">
        <h4 className="text-xs font-bold text-white truncate font-['Hanken_Grotesk',sans-serif]">
          {title}
        </h4>
        <span className="inline-block mt-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/30 capitalize">
          {activeLangLabel} Format
        </span>
      </div>

      {/* Side-by-side Vibrant Download Buttons (PDF & DOCX) */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Download PDF */}
        <button
          type="button"
          onClick={onDownloadPdf}
          className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600/20 to-rose-600/20 hover:from-red-600/35 hover:to-rose-600/35 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold flex items-center gap-1 transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
          title={`Download PDF (${activeLangLabel})`}
        >
          <FileCode className="w-3.5 h-3.5 text-red-400" />
          <span>PDF</span>
        </button>

        {/* Download Word DOCX */}
        <button
          type="button"
          onClick={onDownloadDocx}
          className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/35 hover:to-indigo-600/35 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-bold flex items-center gap-1 transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
          title={`Download DOCX (${activeLangLabel})`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
          <span>DOCX</span>
        </button>
      </div>
    </div>
  );
});

NoteDownloadActionCard.displayName = 'NoteDownloadActionCard';
