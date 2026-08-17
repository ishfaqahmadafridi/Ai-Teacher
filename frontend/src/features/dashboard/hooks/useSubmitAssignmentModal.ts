'use client';

import { useState, useCallback, useMemo } from 'react';
import { formatFileSize } from '../utilities/assignmentsUtils';
import type { AssignmentQuizItem } from '../types/assignments.types';

export function useSubmitAssignmentModal(
  item: AssignmentQuizItem | null,
  onSubmitWork: (
    itemId: string,
    submission: {
      files: { name: string; sizeFormatted: string; fileType: string }[];
      textNote?: string;
    }
  ) => void,
  onClose: () => void
) {
  const [textNote, setTextNote] = useState('');
  const [files, setFiles] = useState<{ name: string; sizeFormatted: string; fileType: string }[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const isAlreadySubmitted = useMemo(() => {
    return item?.status === 'submitted' || item?.status === 'graded';
  }, [item?.status]);

  const handleTextNoteChange = useCallback((val: string) => setTextNote(val), []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).map((f) => ({
        name: f.name,
        sizeFormatted: formatFileSize(f.size),
        fileType: f.name.split('.').pop() || 'file',
      }));
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).map((f) => ({
        name: f.name,
        sizeFormatted: formatFileSize(f.size),
        fileType: f.name.split('.').pop() || 'file',
      }));
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!item) return;

      if (files.length === 0 && !textNote.trim()) {
        alert('Please attach a file or type a text note before turning in your work.');
        return;
      }

      onSubmitWork(item.id, {
        files,
        textNote,
      });

      // Reset
      setFiles([]);
      setTextNote('');
      onClose();
    },
    [item, files, textNote, onSubmitWork, onClose]
  );

  const headerProps = useMemo(
    () => ({
      isAlreadySubmitted,
      title: item?.title || '',
      subject: item?.subject || '',
      onClose,
    }),
    [isAlreadySubmitted, item?.title, item?.subject, onClose]
  );

  const dropzoneProps = useMemo(
    () => ({
      isDragOver,
      onFileDrop: handleFileDrop,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onFileSelect: handleFileSelect,
    }),
    [isDragOver, handleFileDrop, handleDragOver, handleDragLeave, handleFileSelect]
  );

  const filesListProps = useMemo(
    () => ({
      files,
      onRemoveFile: handleRemoveFile,
    }),
    [files, handleRemoveFile]
  );

  const textNoteProps = useMemo(
    () => ({
      textNote,
      onTextNoteChange: handleTextNoteChange,
    }),
    [textNote, handleTextNoteChange]
  );

  return {
    isAlreadySubmitted,
    headerProps,
    dropzoneProps,
    filesListProps,
    textNoteProps,
    textNote,
    files,
    isDragOver,
    handleTextNoteChange,
    handleFileDrop,
    handleFileSelect,
    handleRemoveFile,
    handleDragOver,
    handleDragLeave,
    handleSubmit,
  };
}
