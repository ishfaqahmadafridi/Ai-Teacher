export default function TeacherBody() {
  return (
    <>
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
    </>
  );
}
