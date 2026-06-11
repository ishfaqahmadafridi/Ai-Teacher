import type { TeacherLeftArmProps } from '../../../types/classroom/classroom.types';

export default function TeacherLeftArm({ armAngle, isWriting }: TeacherLeftArmProps) {
  return (
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
          <rect
            x="9"
            y="58"
            width="4"
            height="10"
            rx="1.5"
            fill="white"
            opacity="0.9"
            transform="rotate(-20, 11, 63)"
          />
          {/* chalk dust particles */}
          <circle cx="5" cy="54" r="1.5" fill="white" opacity="0.6" />
          <circle cx="7" cy="50" r="1" fill="white" opacity="0.4" />
          <circle cx="3" cy="57" r="1.2" fill="white" opacity="0.5" />
        </>
      )}
    </g>
  );
}
