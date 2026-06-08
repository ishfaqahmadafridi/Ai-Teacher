/**
 * ChalkText.tsx
 *
 * Renders key points on the board with a live "chalk writing" effect.
 * Each key point appears letter-by-letter, mimicking a professor writing on
 * a blackboard. Points accumulate (never erased) throughout the lecture.
 */

import { useEffect, useRef, useState } from 'react';

interface ChalkTextProps {
  points: string[];      // accumulated key points from all phases so far
  isPlaying: boolean;    // only show during active lecture
}

interface AnimatedPoint {
  text: string;
  visibleChars: number;   // how many characters are currently visible
  done: boolean;          // true once fully written
}

export default function ChalkText({ points, isPlaying }: ChalkTextProps) {
  const [animated, setAnimated] = useState<AnimatedPoint[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  // -- When a new point is added, animate it in character by character -------
  useEffect(() => {
    const newCount = points.length;
    const prevCount = prevLengthRef.current;

    if (newCount <= prevCount) return;

    // Add skeleton entries for new points
    const newPoints: AnimatedPoint[] = points.map((text, i) => {
      if (i < prevCount) {
        // already animated -- return fully revealed
        return animated[i] ?? { text, visibleChars: text.length, done: true };
      }
      return { text, visibleChars: 0, done: false };
    });

    setAnimated(newPoints);
    prevLengthRef.current = newCount;

    // Animate each new point
    for (let pi = prevCount; pi < newCount; pi++) {
      const text = points[pi];
      const CHAR_DELAY = 38; // ms per character
      const pointIndex = pi;

      for (let ci = 1; ci <= text.length; ci++) {
        const t = setTimeout(() => {
          setAnimated(prev => {
            const next = [...prev];
            if (next[pointIndex]) {
              next[pointIndex] = {
                ...next[pointIndex],
                visibleChars: ci,
                done: ci === text.length,
              };
            }
            return next;
          });
        }, ci * CHAR_DELAY);
        timersRef.current.push(t);
      }
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [points]);

  // -- Scroll container to bottom as new points appear ----------------------
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [animated]);

  // -- Reset when lecture ends -----------------------------------------------
  useEffect(() => {
    if (!isPlaying) {
      setAnimated([]);
      prevLengthRef.current = 0;
    }
  }, [isPlaying]);

  if (!isPlaying || animated.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-3 left-3 z-20 pointer-events-none overflow-y-auto max-h-[45%]"
      style={{ maxWidth: '38%' }}
    >
      {animated.map((pt, i) => {
        const visible = pt.text.slice(0, pt.visibleChars);
        return (
          <div
            key={i}
            className="flex items-start gap-2 mb-2"
            style={{
              opacity: pt.visibleChars > 0 ? 1 : 0,
              transition: 'opacity 0.2s',
            }}
          >
            {/* Chalk bullet number */}
            <span
              className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border border-emerald-400/60
                flex items-center justify-center text-[9px] font-bold text-emerald-300"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              {i + 1}
            </span>

            {/* The chalk text */}
            <span
              className="text-[13px] leading-snug text-emerald-100"
              style={{
                fontFamily: "'Caveat', cursive",
                textShadow: '0 0 6px rgba(52,211,153,0.35), 1px 1px 0 rgba(0,0,0,0.6)',
                letterSpacing: '0.01em',
              }}
            >
              {visible}
              {/* Blinking cursor for the point currently being written */}
              {!pt.done && (
                <span
                  className="inline-block w-0.5 h-3.5 bg-emerald-300 ml-0.5 align-middle"
                  style={{ animation: 'chalk-cursor 0.5s step-end infinite' }}
                />
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
