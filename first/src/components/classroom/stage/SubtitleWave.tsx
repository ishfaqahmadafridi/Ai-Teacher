export default function SubtitleWave() {
  return (
    <div className="flex-shrink-0 flex items-end gap-0.5 pb-1 self-end">
      {[0.4, 0.7, 1.0, 0.7, 0.4].map((h, i) => (
        <div
          key={i}
          className="w-0.5 rounded-full bg-blue-400"
          style={{
            height: `${h * 14}px`,
            animation: `sound-bar 0.8s ${i * 120}ms ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
