import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
}

export function GlassCard({ children }: GlassCardProps) {
  return (
    <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-16 relative z-10">
      <div className="max-w-2xl w-full">
        <div
          className="rounded-[32px] p-8 md:p-12"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
        >
          {children}
        </div>
      </div>
    </main>
  );
}
