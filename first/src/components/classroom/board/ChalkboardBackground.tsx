import type { ChalkboardBackgroundProps } from '../../../types/classroom/classroom.types';

export default function ChalkboardBackground({ lectureMode }: ChalkboardBackgroundProps) {
  if (!lectureMode) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.04) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.03) 0%, transparent 60%)
        `,
      }}
    />
  );
}
