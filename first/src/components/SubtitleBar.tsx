/**
 * SubtitleBar.tsx
 * Displays the currently spoken sentence at the bottom of the board.
 * Positioned ABOVE the teacher figure so they don't overlap.
 * Animates in/out per chunk with a speech-bubble style.
 */

import { useEffect, useState } from 'react';

interface SubtitleBarProps {
  text: string;
  isPlaying: boolean;
  chunkIndex: number;
}

export default function SubtitleBar({ text, isPlaying, chunkIndex }: SubtitleBarProps) {
  const [visible, setVisible] = useState(false);
  const [displayText, setDisplayText] = useState('');

  // Fade in on each new chunk, fade out when stopped
  useEffect(() => {
    if (isPlaying && text) {
      setVisible(false);
      setDisplayText(text);
      const timer = setTimeout(() => setVisible(true), 60);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [chunkIndex, isPlaying, text]);

  if (!isPlaying || !displayText) return null;

  return (
    <div
      className="absolute bottom-20 left-4 right-4 z-20 pointer-events-none transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      <div className="mx-auto max-w-2xl">
        {/* Speech bubble with pointer */}
        <div
          className="relative px-5 py-3 rounded-2xl border shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(9,14,28,0.95) 100%)',
            borderColor: 'rgba(59,130,246,0.3)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Blue accent top line */}
          <div
            className="absolute top-0 left-6 right-6 h-px rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)' }}
          />

          <div className="flex items-start gap-3">
            {/* Prof avatar */}
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600
              flex items-center justify-center shadow-md mt-0.5">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1a4 4 0 014 4v2a4 4 0 01-8 0V5a4 4 0 014-4zm-7 20a7 7 0 0114 0H5z" />
              </svg>
            </div>

            {/* Text */}
            <p className="text-white text-sm leading-relaxed font-medium flex-1">{displayText}</p>

            {/* Speaking wave indicator */}
            <div className="flex-shrink-0 flex items-end gap-0.5 pb-1 self-end">
              {[0.4, 0.7, 1.0, 0.7, 0.4].map((h, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full bg-blue-400"
                  style={{
                    height: `${h * 14}px`,
                    animation: `sound-bar 0.8s ${i * 120}ms ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
