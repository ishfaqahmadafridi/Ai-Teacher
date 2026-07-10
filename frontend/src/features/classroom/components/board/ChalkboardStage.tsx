'use client';
import { useAppSelector } from '@/hooks/useAppStore';

export function ChalkboardStage() {
  const points = useAppSelector((s) => s.classroom.chalkboardPoints);
  const isWriting = useAppSelector((s) => s.classroom.isWritingOnBoard);
  const topic = useAppSelector((s) => s.classroom.topic);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Chalkboard frame */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-amber-900/60 shadow-inner overflow-hidden">
        {/* Chalk texture lines */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(0deg,transparent_24px,rgba(255,255,255,0.3)_25px)] bg-[size:100%_25px]" />

        {/* Topic title */}
        {topic && (
          <div className="absolute top-4 left-0 right-0 text-center">
            <span className="text-white/70 font-mono text-lg tracking-widest underline underline-offset-4 decoration-white/30">
              {topic}
            </span>
          </div>
        )}

        {/* Key points in chalk style */}
        <div className="absolute top-14 left-6 right-6 flex flex-col gap-3">
          {points.map((pt, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 transition-all duration-500 ${
                isWriting && i === points.length - 1
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-80 translate-x-0'
              }`}
              style={{
                animation: isWriting && i === points.length - 1
                  ? 'fadeInLeft 0.5s ease-out'
                  : undefined,
              }}
            >
              <span className="text-yellow-200/70 font-mono text-sm mt-0.5 shrink-0">
                {i + 1}.
              </span>
              <p className="text-white/85 font-mono text-sm leading-relaxed tracking-wide">
                {pt}
              </p>
            </div>
          ))}

          {isWriting && (
            <div className="w-2 h-5 bg-white/60 animate-blink rounded-sm ml-5" />
          )}
        </div>

        {/* Chalk tray at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-amber-900/40 rounded-b-xl" />
      </div>
    </div>
  );
}
