'use client';

import { memo } from 'react';
import { Image as ImageIcon, FileText } from 'lucide-react';
import type { AttachmentMenuProps } from '../../types/ask.types';

export const AttachmentMenu = memo(function AttachmentMenu({
  isOpen,
  menuRef,
  onSelectImage,
  onSelectDoc,
  className = '',
}: AttachmentMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`absolute bottom-full left-0 mb-3 bg-dashboard-panel border border-dashboard-border rounded-2xl shadow-lg p-2 z-50 flex flex-col gap-1 min-w-[210px] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200 ${className}`}
    >
      <button
        type="button"
        onClick={onSelectImage}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-dashboard-text hover:bg-dashboard-subtle transition-colors cursor-pointer text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-dashboard-primary/15 border border-dashboard-border flex items-center justify-center text-dashboard-primary shrink-0">
          <ImageIcon className="w-4 h-4" />
        </div>
        <div>
          <div>Upload Photo / Image</div>
          <div className="text-[10px] text-dashboard-muted font-normal">JPG, PNG, WebP</div>
        </div>
      </button>

      <button
        type="button"
        onClick={onSelectDoc}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-dashboard-text hover:bg-dashboard-subtle transition-colors cursor-pointer text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <div>Upload Document / PDF</div>
          <div className="text-[10px] text-dashboard-muted font-normal">PDF, DOCX, TXT</div>
        </div>
      </button>
    </div>
  );
});

AttachmentMenu.displayName = 'AttachmentMenu';
