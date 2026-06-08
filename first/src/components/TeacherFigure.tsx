/**
 * TeacherFigure.tsx
 *
 * An animated SVG physics professor character that:
 *  - Walks left ↔ right between phases based on `position` prop
 *  - Has idle breathing/sway animation
 *  - Raises arm in a "writing on board" gesture when `isWriting` is true
 *  - Never overlaps diagrams -- stays pinned at the bottom corner
 *  - Flips horizontally based on which side it stands (always faces the board)
 */

import { useEffect, useRef, useState } from 'react';

type TeacherPos = 'left' | 'right' | 'center';

interface TeacherFigureProps {
  position: TeacherPos;
  isPlaying: boolean;
  isWriting: boolean;   // arm-raise writing gesture (while key_point is being added)
}

export default function TeacherFigure({ position, isPlaying, isWriting }: TeacherFigureProps) {
  const [currentX, setCurrentX] = useState(position === 'right' ? 88 : 4);
  const [prevPosition, setPrevPosition] = useState<TeacherPos>(position);
  const [isWalking, setIsWalking] = useState(false);
  const [bodyBob, setBodyBob] = useState(0);
  const [armAngle, setArmAngle] = useState(0);
  const bobRef = useRef<number | null>(null);
  const frameRef = useRef(0);

  // -- Target X positions (as % of container width) -------------------------
  const TARGET_X: Record<TeacherPos, number> = { left: 2, center: 42, right: 84 };

  // -- Handle position changes -- smooth walk animation --------------------
  useEffect(() => {
    if (position === prevPosition) return;
    setIsWalking(true);
    setPrevPosition(position);

    const targetX = TARGET_X[position];
    const startX = currentX;
    const dist = Math.abs(targetX - startX);
    const duration = Math.min(1400, 600 + dist * 8); // speed scales with distance
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease in-out cubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setCurrentX(startX + (targetX - startX) * eased);

      if (t < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentX(targetX);
        setIsWalking(false);
      }
    };

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [position]);

  // -- Idle body bob animation ----------------------------------------------
  useEffect(() => {
    if (!isPlaying) {
      setBodyBob(0);
      if (bobRef.current) clearInterval(bobRef.current);
      return;
    }
    let t = 0;
    bobRef.current = window.setInterval(() => {
      t += 0.1;
      setBodyBob(Math.sin(t) * 1.8);
    }, 40);
    return () => { if (bobRef.current) clearInterval(bobRef.current); };
  }, [isPlaying]);

  // -- Arm angle for writing gesture ----------------------------------------
  useEffect(() => {
    setArmAngle(isWriting ? -70 : 0);
  }, [isWriting]);

  // -- Determine which way the teacher faces (always faces the board/center) --
  // left side: faces right (no flip). right side: faces left (flip).
  const facingRight = position !== 'right';
  const flip = facingRight ? 1 : -1;

  if (!isPlaying) return null;

  return (
    <div
      className="absolute bottom-0 transition-none pointer-events-none z-30"
      style={{
        left: `${currentX}%`,
        transform: `translateY(0)`,
        width: '64px',
        transition: 'left 0s', // JS-driven animation
      }}
    >
      <svg
        width="64"
        height="108"
        viewBox="0 0 64 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `scaleX(${flip})`,
          filter: 'drop-shadow(0 4px 12px rgba(59,130,246,0.4))',
        }}
      >
        {/* Shadow under feet */}
        <ellipse cx="32" cy="105" rx="14" ry="3" fill="rgba(0,0,0,0.3)" />

        {/* === BODY GROUP (bobs up/down) === */}
        <g transform={`translate(0, ${bodyBob})`}>

          {/* Graduation cap */}
          <rect x="18" y="8" width="28" height="4" rx="1" fill="#1e3a5f" />
          <rect x="22" y="4" width="20" height="5" rx="2" fill="#1e3a5f" />
          <line x1="46" y1="10" x2="50" y2="16" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="50" cy="17" r="2" fill="#facc15" />

          {/* Head */}
          <circle cx="32" cy="23" r="9" fill="#FDDBB4" stroke="#d4967a" strokeWidth="0.8" />
          {/* Eyes */}
          <circle cx="28.5" cy="22" r="1.4" fill="#1a1a2e" />
          <circle cx="35.5" cy="22" r="1.4" fill="#1a1a2e" />
          <circle cx="29" cy="21.5" r="0.5" fill="white" />
          <circle cx="36" cy="21.5" r="0.5" fill="white" />
          {/* Smile */}
          <path d="M28 26 Q32 29.5 36 26" stroke="#c97048" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          {/* Glasses */}
          <rect x="25" y="20" width="7" height="5" rx="2" stroke="#334155" strokeWidth="1" fill="none" />
          <rect x="33" y="20" width="7" height="5" rx="2" stroke="#334155" strokeWidth="1" fill="none" />
          <line x1="32" y1="22.5" x2="33" y2="22.5" stroke="#334155" strokeWidth="1" />
          {/* Ear */}
          <ellipse cx="23" cy="23" rx="2" ry="2.5" fill="#FDDBB4" stroke="#d4967a" strokeWidth="0.6" />

          {/* Neck */}
          <rect x="29" y="31" width="6" height="5" rx="1" fill="#FDDBB4" />

          {/* Body / Suit jacket */}
          <path d="M16 75 L16 42 Q16 36 32 36 Q48 36 48 42 L48 75 Z" fill="#1e3a5f" />
          {/* Shirt / tie */}
          <path d="M28 36 L32 40 L36 36" fill="white" />
          <path d="M30 38 L32 44 L34 38" fill="#ef4444" />
          {/* Lapels */}
          <path d="M32 36 L24 44 L20 44 L20 38" fill="#274870" />
          <path d="M32 36 L40 44 L44 44 L44 38" fill="#274870" />
          {/* Suit buttons */}
          <circle cx="32" cy="52" r="1.2" fill="#274870" />
          <circle cx="32" cy="58" r="1.2" fill="#274870" />

          {/* LEFT arm (pointing arm -- raised for writing) */}
          <g
            style={{
              transformOrigin: '22px 40px',
              transform: `rotate(${armAngle}deg)`,
              transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <path d="M22 40 L14 60" stroke="#1e3a5f" strokeWidth="7" strokeLinecap="round" />
            {/* Sleeve */}
            <path d="M22 40 L14 60" stroke="#274870" strokeWidth="5" strokeLinecap="round" />
            {/* Hand */}
            <circle cx="14" cy="62" r="4" fill="#FDDBB4" />
            {/* Chalk in hand (only when writing) */}
            {isWriting && (
              <>
                <rect x="9" y="58" width="4" height="10" rx="1.5" fill="white" opacity="0.9"
                  transform="rotate(-20, 11, 63)" />
                {/* chalk dust particles */}
                <circle cx="5" cy="54" r="1.5" fill="white" opacity="0.6" />
                <circle cx="7" cy="50" r="1" fill="white" opacity="0.4" />
                <circle cx="3" cy="57" r="1.2" fill="white" opacity="0.5" />
              </>
            )}
          </g>

          {/* RIGHT arm (at side / slightly gesturing) */}
          <path d="M42 40 L50 58" stroke="#1e3a5f" strokeWidth="7" strokeLinecap="round" />
          <path d="M42 40 L50 58" stroke="#274870" strokeWidth="5" strokeLinecap="round" />
          <circle cx="50" cy="60" r="4" fill="#FDDBB4" />

          {/* Legs */}
          {/* Left leg */}
          <path
            d={isWalking
              ? "M26 74 L22 92 L20 106"
              : "M26 74 L24 92 L23 106"}
            stroke="#1e3a5f"
            strokeWidth="8"
            strokeLinecap="round"
            style={{ transition: 'all 0.3s' }}
          />
          {/* Right leg */}
          <path
            d={isWalking
              ? "M38 74 L42 92 L44 106"
              : "M38 74 L40 92 L41 106"}
            stroke="#1e3a5f"
            strokeWidth="8"
            strokeLinecap="round"
            style={{ transition: 'all 0.3s' }}
          />

          {/* Shoes */}
          <ellipse cx="22" cy="106" rx="7" ry="3" fill="#0f172a" />
          <ellipse cx="42" cy="106" rx="7" ry="3" fill="#0f172a" />
        </g>
      </svg>

      {/* Speaking indicator bubbles above head */}
      {isPlaying && !isWriting && (
        <div
          className="absolute flex gap-1 items-end"
          style={{
            bottom: '108px',
            left: facingRight ? '30px' : '-10px',
            transform: `translateY(${bodyBob}px)`,
          }}
        >
          {[0, 150, 300].map(delay => (
            <div
              key={delay}
              className="rounded-full bg-blue-400"
              style={{
                width: '5px',
                height: '5px',
                animation: `bounce 0.8s ${delay}ms infinite`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
