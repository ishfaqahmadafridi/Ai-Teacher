'use client';

import { memo } from 'react';
import { File, Trash2 } from 'lucide-react';
import type { SubmitAssignmentFilesListProps } from '../../types/assignments.types';

export const SubmitAssignmentFilesList = memo(function SubmitAssignmentFilesList({
  files,
  onRemoveFile,
  className = '',
}: SubmitAssignmentFilesListProps) {
  if (files.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
        Attached Files ({files.length})
      </div>
      <div className="space-y-2">
        {files.map((file, idx) => (
          <div
            key={idx}
            className="p-3 rounded-2xl bg-[#090D16] border border-[#1E293B] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <File className="w-4 h-4 text-[#38BDF8]" />
              <div>
                <div className="text-xs font-bold text-white">{file.name}</div>
                <div className="text-[10px] text-[#64748B]">{file.sizeFormatted}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRemoveFile(idx)}
              className="p-1.5 rounded-lg bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

SubmitAssignmentFilesList.displayName = 'SubmitAssignmentFilesList';
