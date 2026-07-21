'use client';

interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: '26+', label: 'Disciplines' },
  { value: '∞', label: 'Learning Paths' },
  { value: 'AI', label: 'Powered' },
];

export function StatsStrip() {
  return (
    <div
      className="flex gap-16 mt-14"
      style={{
        animation: 'intro-fadeInUp 1.0s cubic-bezier(0.16, 1, 0.3, 1) 1.8s both',
      }}
    >
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center">
          <div
            className="text-blue-300 font-bold leading-none"
            style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}
          >
            {stat.value}
          </div>
          <div className="font-sans text-[11px] font-medium tracking-widest uppercase text-blue-200/40 mt-1.5">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
