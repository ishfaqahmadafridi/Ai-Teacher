import type { ReactNode } from 'react';

interface SubtitleBubbleProps {
  children: ReactNode;
}

export default function SubtitleBubble({ children }: SubtitleBubbleProps) {
  return (
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
      {children}
    </div>
  );
}
