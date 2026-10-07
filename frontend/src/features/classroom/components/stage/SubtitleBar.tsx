'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useSubtitleBar } from '../../hooks/useSubtitleBar';

export function SubtitleBar() {
  const { spokenText, isVisible, subtitleRef, hideSubtitles } = useSubtitleBar();

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
      <div className="mx-auto max-w-3xl px-4 pb-4">
        <div
          ref={subtitleRef}
          className="relative bg-black/80 backdrop-blur-md rounded-2xl px-8 py-3.5 border border-white/15 text-center shadow-xl pointer-events-auto group"
        >
          <div className="text-white text-sm sm:text-base leading-relaxed font-medium prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {spokenText}
            </ReactMarkdown>
          </div>

          {/* User Choice: Hide / Close Subtitles Button */}
          <button
            type="button"
            onClick={hideSubtitles}
            title="Hide Subtitles (Click to hide / choose subtitles)"
            className="absolute top-2.5 right-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer opacity-70 group-hover:opacity-100"
          >
            <span className="sr-only">Hide Subtitles</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
