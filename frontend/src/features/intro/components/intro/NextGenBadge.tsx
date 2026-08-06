'use client';

export function NextGenBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-400/8 border border-blue-400/20 mb-8"
      style={{
        animation: 'intro-fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-[#63b3ed] shadow-[0_0_8px_rgba(99,179,237,0.8)] animate-pulse" />
      <span className="font-sans text-[12px] font-semibold tracking-[0.12em] uppercase text-blue-200/90">
        Next-Generation AI Education
      </span>
    </div>
  );
}
