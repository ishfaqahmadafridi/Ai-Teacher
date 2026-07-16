'use client';

import type { SymbolData } from '../types/intro.types';

const SYMBOLS: SymbolData[] = [
  { text: 'E = mc²', x: 8, y: 15, size: 13, delay: 0 },
  { text: 'Σ', x: 92, y: 20, size: 28, delay: 1.2 },
  { text: '∫∞', x: 18, y: 72, size: 18, delay: 2.4 },
  { text: 'DNA', x: 85, y: 65, size: 14, delay: 0.8 },
  { text: 'π', x: 5, y: 45, size: 32, delay: 3.1 },
  { text: '∇', x: 78, y: 38, size: 22, delay: 1.7 },
  { text: 'if (x)', x: 72, y: 80, size: 12, delay: 2.0 },
  { text: 'Δx→0', x: 30, y: 88, size: 11, delay: 0.5 },
  { text: 'H₂O', x: 50, y: 10, size: 14, delay: 1.9 },
  { text: '⚛', x: 88, y: 10, size: 20, delay: 2.8 },
  { text: '∞', x: 60, y: 85, size: 26, delay: 0.3 },
  { text: 'λ', x: 40, y: 78, size: 20, delay: 3.5 },
  { text: 'F = ma', x: 15, y: 30, size: 12, delay: 4.0 },
  { text: '01', x: 95, y: 50, size: 14, delay: 1.1 },
];

export function FloatingSymbols() {
  return (
    <div className="absolute inset-0 z-[3] pointer-events-none select-none">
      {SYMBOLS.map((symbol, index) => (
        <div
          key={`${symbol.text}-${index}`}
          className="absolute font-mono font-light text-blue-200/10 tracking-widest"
          style={{
            left: `${symbol.x}%`,
            top: `${symbol.y}%`,
            fontSize: `${symbol.size}px`,
            animation: `intro-driftCard ${6 + (index % 4)}s ease-in-out ${symbol.delay}s infinite`,
          }}
        >
          {symbol.text}
        </div>
      ))}
    </div>
  );
}
