'use client';
import { useAppSelector } from '@/hooks/useAppStore';

export function TeacherFigure() {
  const position = useAppSelector((s) => s.classroom.teacherPosition);
  const isWriting = useAppSelector((s) => s.classroom.isWritingOnBoard);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);

  const posClass =
    position === 'left'
      ? 'left-[8%]'
      : position === 'right'
      ? 'right-[8%]'
      : 'left-1/2 -translate-x-1/2';

  return (
    <div
      className={`absolute bottom-0 ${posClass} transition-all duration-700 ease-in-out select-none pointer-events-none`}
      style={{ width: 120 }}
    >
      <svg
        viewBox="0 0 120 220"
        width="120"
        height="220"
        xmlns="http://www.w3.org/2000/svg"
        className={isPlaying ? 'animate-teacher-idle' : ''}
      >
        {/* Graduation cap */}
        <rect x="35" y="10" width="50" height="6" rx="3" fill="#1e1b4b" />
        <rect x="44" y="4" width="32" height="8" rx="3" fill="#312e81" />
        <line x1="60" y1="16" x2="80" y2="28" stroke="#7c3aed" strokeWidth="1.5" />
        <circle cx="82" cy="30" r="3" fill="#a78bfa" />

        {/* Head */}
        <circle cx="60" cy="38" r="20" fill="#fcd9b5" />
        {/* Eyes */}
        <ellipse cx="53" cy="35" rx="3" ry="3.5" fill="#1e1b4b" />
        <ellipse cx="67" cy="35" rx="3" ry="3.5" fill="#1e1b4b" />
        <circle cx="54" cy="34" r="1" fill="white" />
        <circle cx="68" cy="34" r="1" fill="white" />
        {/* Mouth */}
        <path
          d={isPlaying ? 'M 52 46 Q 60 52 68 46' : 'M 52 46 Q 60 50 68 46'}
          stroke="#c2410c"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Glasses */}
        <path
          d="M 48 34 Q 53 30 58 34 M 62 34 Q 67 30 72 34"
          stroke="#475569"
          strokeWidth="1.5"
          fill="none"
        />
        <line x1="58" y1="34" x2="62" y2="34" stroke="#475569" strokeWidth="1.5" />

        {/* Body / Gown */}
        <path
          d="M 40 58 Q 30 100 32 160 L 88 160 Q 90 100 80 58 Z"
          fill="#1e3a5f"
        />
        {/* Collar */}
        <path d="M 55 58 L 60 72 L 65 58" fill="white" />

        {/* Left arm */}
        <path
          d={isWriting ? 'M 40 80 Q 20 110 10 140' : 'M 40 80 Q 25 120 30 155'}
          stroke="#1e3a5f"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-500"
        />
        {/* Right arm */}
        <path
          d="M 80 80 Q 95 115 90 150"
          stroke="#1e3a5f"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />

        {/* Chalk in left hand */}
        {isWriting && (
          <rect x="4" y="138" width="12" height="4" rx="2" fill="#f1f5f9" transform="rotate(-40 10 140)" />
        )}

        {/* Legs */}
        <rect x="45" y="158" width="12" height="55" rx="6" fill="#0f172a" />
        <rect x="63" y="158" width="12" height="55" rx="6" fill="#0f172a" />
        {/* Shoes */}
        <ellipse cx="51" cy="213" rx="10" ry="5" fill="#0f172a" />
        <ellipse cx="69" cy="213" rx="10" ry="5" fill="#0f172a" />
      </svg>
    </div>
  );
}
