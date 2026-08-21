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
      className={`absolute bottom-full left-0 mb-3 bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 min-w-[210px] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200 ${className}`}
    >
      <button
        type="button"
        onClick={onSelectImage}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white hover:bg-[#1E293B] transition-colors cursor-pointer text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
          <ImageIcon className="w-4 h-4" />
        </div>
        <div>
          <div>Upload Photo / Image</div>
          <div className="text-[10px] text-[#94A3B8] font-normal">JPG, PNG, WebP</div>
        </div>
      </button>

      <button
        type="button"
        onClick={onSelectDoc}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white hover:bg-[#1E293B] transition-colors cursor-pointer text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C4B5FD] shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <div>Upload Document / PDF</div>
          <div className="text-[10px] text-[#94A3B8] font-normal">PDF, DOCX, TXT</div>
        </div>
      </button>
    </div>
  );
});

AttachmentMenu.displayName = 'AttachmentMenu';
