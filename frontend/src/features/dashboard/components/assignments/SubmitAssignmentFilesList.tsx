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
      <div className="text-xs font-bold text-dashboard-muted uppercase tracking-wider">
        Attached Files ({files.length})
      </div>
      <div className="space-y-2">
        {files.map((file, idx) => (
          <div
            key={idx}
            className="p-3 rounded-2xl bg-dashboard-panel border border-dashboard-border flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <File className="w-4 h-4 text-dashboard-primary" />
              <div>
                <div className="text-xs font-bold text-dashboard-text">{file.name}</div>
                <div className="text-[10px] text-dashboard-muted">{file.sizeFormatted}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRemoveFile(idx)}
              className="p-1.5 rounded-lg bg-dashboard-danger/10 text-dashboard-danger hover:bg-dashboard-danger/20 transition-all cursor-pointer"
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
