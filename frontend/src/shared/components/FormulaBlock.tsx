'use client';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface FormulaBlockProps {
  children: string;
  className?: string;
}

/**
 * Reusable component for rendering text that may contain KaTeX math expressions.
 * Use this anywhere you render content from the backend that could contain formulas.
 */
export function FormulaBlock({ children, className = '' }: FormulaBlockProps) {
  return (
    <div className={`formula-block ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <span>{children}</span>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
