'use client';
import { memo } from 'react';
import { useNoteFigurePreview } from '../../../hooks/useNoteFigurePreview';
import type { NoteFigurePreviewProps } from '../../../types/notes.types';
export const NoteFigurePreview = memo(function NoteFigurePreview({ noteId, index, caption }: NoteFigurePreviewProps) {
  const { data, isError } = useNoteFigurePreview(noteId, index);
  if (isError) return <p role="status">The saved diagram could not be loaded.</p>;
  if (!data) return null;
  // Saved authenticated data URLs are intentionally rendered without a remote optimizer.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={data} alt={caption || 'Diagram shown during this lecture section'} className="mt-2 max-w-full rounded-lg" />;
});
NoteFigurePreview.displayName = 'NoteFigurePreview';
