import type { TeacherLegsProps } from '../../../types/classroom/classroom.types';

export default function TeacherLegs({ isWalking }: TeacherLegsProps) {
  return (
    <>
      {/* Left leg */}
      <path
        d={isWalking ? 'M26 74 L22 92 L20 106' : 'M26 74 L24 92 L23 106'}
        stroke="#1e3a5f"
        strokeWidth="8"
        strokeLinecap="round"
        style={{ transition: 'all 0.3s' }}
      />
      {/* Right leg */}
      <path
        d={isWalking ? 'M38 74 L42 92 L44 106' : 'M38 74 L40 92 L41 106'}
        stroke="#1e3a5f"
        strokeWidth="8"
        strokeLinecap="round"
        style={{ transition: 'all 0.3s' }}
      />

      {/* Shoes */}
      <ellipse cx="22" cy="106" rx="7" ry="3" fill="#0f172a" />
      <ellipse cx="42" cy="106" rx="7" ry="3" fill="#0f172a" />
    </>
  );
}
