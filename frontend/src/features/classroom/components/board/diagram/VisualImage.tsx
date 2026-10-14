'use client';
import { memo } from 'react';
import Image from 'next/image';
import { useVisualImage } from '../../../hooks/useVisualImage';
export const VisualImage = memo(function VisualImage({ src, annotation }: { src: string; annotation?: string }) {
  const { failed, onError } = useVisualImage();
  if (failed) return <p role="status">This illustration could not load. The explanation remains available.</p>;
  return <figure className="flex h-full flex-col gap-2 overflow-auto"><div className="relative min-h-64 flex-1"><Image data-lecture-image src={src} alt={annotation?.split('\n')[0] || 'Educational illustration'} fill unoptimized className="object-contain" onError={onError} /></div><figcaption className="whitespace-pre-line text-xs text-slate-300">{annotation}</figcaption></figure>;
});
VisualImage.displayName = 'VisualImage';
