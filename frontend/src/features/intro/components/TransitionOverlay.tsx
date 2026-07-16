'use client';

export function TransitionOverlay() {
  return (
    <div
      className="fixed inset-0 bg-[#020714] z-[100] flex items-center justify-center"
      style={{
        animation: 'intro-fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <div className="text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin mb-5" />
        <p className="font-sans text-sm text-blue-200/60 tracking-widest uppercase animate-pulse">
          Entering the platform…
        </p>
      </div>
    </div>
  );
}
