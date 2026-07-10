'use client';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useAppSelector } from '@/hooks/useAppStore';

export function SubtitleBar() {
  const spokenText = useAppSelector((s) => s.classroom.spokenText);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);
  const currentChunkIndex = useAppSelector((s) => s.classroom.currentChunkIndex);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChunkIndex]);

  if (!isPlaying || !spokenText) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
      <div className="mx-auto max-w-3xl px-4 pb-4">
        <div
          ref={ref}
          className="bg-black/75 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/10 text-center"
        >
          <div className="text-white text-base leading-relaxed font-medium prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {spokenText}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
