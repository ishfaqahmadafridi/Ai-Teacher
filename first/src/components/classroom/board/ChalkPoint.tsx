import { useChalkAnimation } from '../../../hooks/classroom/useChalkAnimation';

interface ChalkPointProps {
  text: string;
  index: number;
}

export default function ChalkPoint({ text, index }: ChalkPointProps) {
  const { visibleText, visibleChars, done } = useChalkAnimation(text);

  return (
    <div
      className="flex items-start gap-2 mb-2"
      style={{
        opacity: visibleChars > 0 ? 1 : 0,
        transition: 'opacity 0.2s',
      }}
    >
      {/* Chalk bullet number */}
      <span
        className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border border-emerald-400/60
          flex items-center justify-center text-[9px] font-bold text-emerald-300"
        style={{ fontFamily: "'Caveat', cursive" }}
      >
        {index + 1}
      </span>

      {/* The chalk text */}
      <span
        className="text-[13px] leading-snug text-emerald-100"
        style={{
          fontFamily: "'Caveat', cursive",
          textShadow: '0 0 6px rgba(52,211,153,0.35), 1px 1px 0 rgba(0,0,0,0.6)',
          letterSpacing: '0.01em',
        }}
      >
        {visibleText}
        {/* Blinking cursor for the point currently being written */}
        {!done && (
          <span
            className="inline-block w-0.5 h-3.5 bg-emerald-300 ml-0.5 align-middle"
            style={{ animation: 'chalk-cursor 0.5s step-end infinite' }}
          />
        )}
      </span>
    </div>
  );
}
