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
      <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
        Upload File Deliverables (PDF, Notebook, DOCX, Code)
      </label>
      <div
        onDrop={onFileDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all flex flex-col items-center justify-center gap-3 ${
          isDragOver
            ? 'border-[#2563EB] bg-[#2563EB]/10'
            : 'border-[#1E293B] bg-[#090D16] hover:border-[#334155]'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/20 text-[#38BDF8] flex items-center justify-center">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            Drag and drop your files here, or{' '}
            <label className="text-[#38BDF8] hover:underline cursor-pointer">
              browse
              <input
                type="file"
                multiple
                onChange={onFileSelect}
                className="hidden"
              />
            </label>
          </p>
          <p className="text-xs text-[#64748B] mt-1">
            Supports .pdf, .docx, .ipynb, .py, .zip (Max 50MB)
          </p>
        </div>
      </div>
    </div>
  );
});

SubmitAssignmentDropzone.displayName = 'SubmitAssignmentDropzone';
