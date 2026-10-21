 'use client';
import { memo } from 'react';
import { ArrowDownRight, BookOpen } from 'lucide-react';
import { useBoardWelcome } from '../../hooks/useBoardWelcome';
import { BOARD_WELCOME_STEPS } from '../../constants/boardWelcomeConstants';
import type { ChalkboardWelcomeSlateProps } from '../../types/board.types';

export const ChalkboardWelcomeSlate = memo(function ChalkboardWelcomeSlate({ className = '' }: ChalkboardWelcomeSlateProps) {
  const { focusQuestion } = useBoardWelcome();
  return <section className={`classroom-board-welcome relative z-10 flex flex-col items-start ${className}`} aria-labelledby="board-welcome-title">
    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-classroom-board-border bg-dashboard-selected text-dashboard-primary">
      <BookOpen className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
    </div>
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-classroom-board-muted">Your learning space</p>
    <h2 id="board-welcome-title" className="max-w-[36rem] text-3xl font-semibold leading-[1.15] tracking-tight text-classroom-board-text sm:text-4xl lg:text-5xl">Make room for your<br className="hidden sm:block" /> next idea.</h2>
    <p className="mt-5 max-w-[34rem] text-sm leading-7 text-classroom-board-muted sm:text-base">Bring a question, a course topic, or a problem you’re working on. We’ll break it down together, one step at a time.</p>
    <button type="button" onClick={focusQuestion} className="classroom-board-start mt-7 inline-flex min-h-11 items-center justify-center gap-3 rounded-lg bg-dashboard-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-dashboard-primary-hover disabled:opacity-50">
      Start with a question <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
    </button>
    <div className="mt-10 grid w-full grid-cols-1 gap-5 border-t border-classroom-board-border pt-6 sm:grid-cols-3 sm:gap-6">
      {BOARD_WELCOME_STEPS.map(({ icon: Icon, title, description }) => <div key={title} className="flex items-start gap-3 sm:flex-col">
        <Icon className="h-4 w-4 shrink-0 text-classroom-board-muted" strokeWidth={1.75} aria-hidden="true" />
        <div><h3 className="text-xs font-semibold leading-5 text-classroom-board-text">{title}</h3><p className="mt-1 text-xs leading-5 text-classroom-board-muted">{description}</p></div>
      </div>)}
    </div>
  </section>;
});
ChalkboardWelcomeSlate.displayName = 'ChalkboardWelcomeSlate';
