'use client';

export function LiveDotsBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div
        className="absolute top-[25%] left-[30%] w-2 h-2 bg-[#b8c3ff] text-[#b8c3ff] rounded-full live-dot"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="absolute top-[55%] left-[20%] w-3 h-3 bg-white text-white rounded-full live-dot"
        style={{ animationDelay: '1.5s' }}
      />
      <div
        className="absolute top-[40%] left-[75%] w-2 h-2 bg-[#a2e7ff] text-[#a2e7ff] rounded-full live-dot"
        style={{ animationDelay: '0.7s' }}
      />
      <div
        className="absolute top-[70%] left-[65%] w-2.5 h-2.5 bg-white text-white rounded-full live-dot"
        style={{ animationDelay: '2.2s' }}
      />
      <div
        className="absolute top-[80%] left-[35%] w-1.5 h-1.5 bg-[#b8c3ff] text-[#b8c3ff] rounded-full live-dot"
        style={{ animationDelay: '3.1s' }}
      />
    </div>
  );
}
