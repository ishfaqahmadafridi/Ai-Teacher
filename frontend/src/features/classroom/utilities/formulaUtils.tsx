import React from 'react';

/**
 * Dynamically parses any mathematical formula string into tokens
 * with color-coded syntax highlighting according to token type.
 */
export function renderFormattedFormula(formula: string): React.ReactNode {
  if (!formula || typeof formula !== 'string') return null;

  // Tokenize equation preserving operators, variables, and numbers
  const tokens = formula.split(/([=+\-*/^() ,])/g);

  return (
    <>
      {tokens.map((token, idx) => {
        if (!token) return null;

        // Operators & Equals
        if (['=', '+', '-', '*', '/', '^'].includes(token)) {
          return (
            <span key={idx} className="text-white/40 font-bold mx-1.5 select-none">
              {token}
            </span>
          );
        }

        // Grouping Parentheses
        if (['(', ')'].includes(token)) {
          return (
            <span key={idx} className="text-white/60 font-semibold select-none">
              {token}
            </span>
          );
        }

        // Single Variables (e.g., F, m, a, E, c, v, t, r)
        if (/^[a-zA-Z]$/.test(token)) {
          const charCode = token.charCodeAt(0);
          const colorClasses = [
            'text-[#b8c3ff]', // Electric Blue
            'text-[#6ffbbe]', // Emerald
            'text-[#ffb59b]', // Warm Coral
            'text-[#d0bcff]', // Purple Glow
            'text-[#80d5d4]', // Teal Glow
          ];
          const colorClass = colorClasses[charCode % colorClasses.length];

          return (
            <span key={idx} className={`font-semibold ${colorClass}`}>
              {token}
            </span>
          );
        }

        // Multi-letter symbols or words
        if (/^[a-zA-Z]{2,}$/.test(token)) {
          return (
            <span key={idx} className="text-[#b8c3ff] font-semibold">
              {token}
            </span>
          );
        }

        // Numbers (e.g., 2, 9.8, 100)
        if (/^[0-9]+(\.[0-9]+)?$/.test(token)) {
          return (
            <span key={idx} className="text-[#ffd8e4] font-mono font-medium">
              {token}
            </span>
          );
        }

        // Spaces and fallback
        return <span key={idx}>{token}</span>;
      })}
    </>
  );
}
