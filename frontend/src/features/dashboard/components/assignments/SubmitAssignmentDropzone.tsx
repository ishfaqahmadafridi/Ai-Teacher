'use client';

import { memo } from 'react';
import { Upload } from 'lucide-react';
import type { SubmitAssignmentDropzoneProps } from '../../types/assignments.types';

export const SubmitAssignmentDropzone = memo(function SubmitAssignmentDropzone({
  isDragOver,
  onFileDrop,
  onDragOver,
  onDragLeave,
  onFileSelect,
  className = '',
}: SubmitAssignmentDropzoneProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-bold text-dashboard-muted uppercase tracking-wider">
        Upload File Deliverables (PDF, Notebook, DOCX, Code)
      </label>
      <div
        onDrop={onFileDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all flex flex-col items-center justify-center gap-3 ${
          isDragOver
            ? 'border-dashboard-primary bg-dashboard-primary/10'
            : 'border-dashboard-border bg-dashboard-panel hover:border-dashboard-border'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-dashboard-primary/20 text-dashboard-primary flex items-center justify-center">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-dashboard-text">
            Drag and drop your files here, or{' '}
            <label className="text-dashboard-primary hover:underline cursor-pointer">
              browse
              <input
                type="file"
                multiple
                onChange={onFileSelect}
                className="hidden"
              />
            </label>
          </p>
          <p className="text-xs text-dashboard-muted mt-1">
            Supports .pdf, .docx, .ipynb, .py, .zip (Max 50MB)
          </p>
        </div>
      </div>
    </div>
  );
});

SubmitAssignmentDropzone.displayName = 'SubmitAssignmentDropzone';
