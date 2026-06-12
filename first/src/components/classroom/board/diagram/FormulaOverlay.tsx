import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { FormulaOverlayProps } from '../../../../types/classroom/classroom.types';

export default function FormulaOverlay({ command, formula }: FormulaOverlayProps) {
  const rawFormula = formula || command?.formula;
  const showFormula =
    (command?.action === 'show_formula_stepwise' || command?.action === 'show_formula') &&
    rawFormula;

  if (!showFormula) return null;

  // Clean the formula string (strip wrapping $$ or $ symbols)
  let cleanFormula = rawFormula.trim();
  if (cleanFormula.startsWith('$$') && cleanFormula.endsWith('$$')) {
    cleanFormula = cleanFormula.slice(2, -2).trim();
  } else if (cleanFormula.startsWith('$') && cleanFormula.endsWith('$')) {
    cleanFormula = cleanFormula.slice(1, -1).trim();
  }

  let html: string;
  try {
    // Render formula to string using KaTeX
    html = katex.renderToString(cleanFormula, { displayMode: true, throwOnError: false });
  } catch {
    html = cleanFormula;
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
      <div
        className="px-8 py-4 rounded-2xl backdrop-blur shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(15,20,40,0.92) 100%)',
          border: '1px solid rgba(250,204,21,0.4)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 24px rgba(250,204,21,0.08)',
        }}
      >
        <div
          className="text-yellow-300 text-2xl font-mono text-center tracking-wide"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
