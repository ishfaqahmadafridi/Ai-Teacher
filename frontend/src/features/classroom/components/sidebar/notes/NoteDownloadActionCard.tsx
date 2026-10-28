'use client';

import { memo } from 'react';
import type { NoteDownloadActionCardProps } from '../../../types/sidebar.types';

export const NoteDownloadActionCard = memo(function NoteDownloadActionCard({
  onDownloadPdf, onDownloadDocx, className = '',
}: NoteDownloadActionCardProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button type="button" onClick={onDownloadPdf}
        className="rounded-lg border border-dashboard-border px-3 py-2 text-xs font-semibold text-dashboard-text hover:bg-dashboard-subtle focus-visible:ring-2 focus-visible:ring-dashboard-primary disabled:opacity-50">
        PDF
      </button>
      <button type="button" onClick={onDownloadDocx}
        className="rounded-lg border border-dashboard-border px-3 py-2 text-xs font-semibold text-dashboard-text hover:bg-dashboard-subtle focus-visible:ring-2 focus-visible:ring-dashboard-primary disabled:opacity-50">
        DOCX
      </button>
    </div>
  );
});
NoteDownloadActionCard.displayName = 'NoteDownloadActionCard';
