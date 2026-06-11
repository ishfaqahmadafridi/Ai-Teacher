import GraduationCap from './GraduationCap';

export default function TeacherHead() {
  return (
    <>
      <GraduationCap />
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
    </>
  );
}
