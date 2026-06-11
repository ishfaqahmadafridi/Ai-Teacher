import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import type { AskMessageBubbleProps } from '../../../types/classroom/classroom.types';

export default function AskMessageBubble({ role, content }: AskMessageBubbleProps) {
  return (
    <div
      className={`relative group px-5 py-4 rounded-2xl shadow-lg
      ${
        role === 'user'
          ? 'bg-gradient-to-br from-violet-600/70 to-purple-700/70 border border-purple-500/30 text-white rounded-tr-sm text-sm'
          : 'bg-slate-800/60 backdrop-blur border border-white/[0.08] text-slate-100 rounded-tl-sm'
      }`}
    >
      {role === 'assistant' ? (
        <div
          className="
            prose prose-invert prose-sm max-w-none
            prose-h3:text-blue-300 prose-h3:font-bold prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
            prose-h2:text-white prose-h2:text-lg
            prose-p:text-slate-200 prose-p:leading-relaxed prose-p:my-1.5
            prose-li:text-slate-200 prose-li:my-1
            prose-strong:text-white prose-strong:font-semibold
            prose-code:text-emerald-300 prose-code:bg-emerald-500/10 prose-code:px-1 prose-code:rounded
            prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
            prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-500/10 prose-blockquote:rounded-r-lg prose-blockquote:py-0.5
            prose-hr:border-white/10
            [&_.katex]:text-yellow-300 [&_.katex-display]:my-4 [&_.katex-display]:overflow-x-auto
            [&_svg]:max-w-full [&_svg]:mx-auto [&_svg]:block [&_svg]:my-4
          "
        >
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="leading-relaxed whitespace-pre-wrap">{content}</p>
      )}
    </div>
  );
}
