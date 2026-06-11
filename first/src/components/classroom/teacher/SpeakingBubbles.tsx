interface SpeakingBubblesProps {
  bodyBob: number;
  facingRight: boolean;
}

export default function SpeakingBubbles({ bodyBob, facingRight }: SpeakingBubblesProps) {
  return (
    <div
      className="absolute flex gap-1 items-end"
      style={{
        bottom: '108px',
        left: facingRight ? '30px' : '-10px',
        transform: `translateY(${bodyBob}px)`,
      }}
    >
      {[0, 150, 300].map(delay => (
        <div
          key={delay}
          className="rounded-full bg-blue-400"
          style={{
            width: '5px',
            height: '5px',
            animation: `bounce 0.8s ${delay}ms infinite`,
          }}
        />
      ))}
    </div>
  );
}
