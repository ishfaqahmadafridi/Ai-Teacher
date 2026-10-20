'use client';

import { memo } from 'react';
import { History, ArrowRight } from 'lucide-react';
import type { AskHistoryViewProps } from '../../types/ask.types';

export const AskHistoryView = memo(function AskHistoryView({ messages, onReturnToChat }: AskHistoryViewProps) {
  return (
    <main className="flex-1 overflow-y-auto px-5 pt-28 pb-10">
      <div className="mx-auto max-w-[48rem]">
        <h1 className="text-2xl font-semibold tracking-tight">Chat history</h1>
        <p className="mt-2 text-sm text-dashboard-muted">Messages from your current session. Previous sessions are not available here.</p>
        <div className="mt-7 rounded-2xl border border-dashboard-border bg-dashboard-panel p-5">
          {messages.length ? (
            <>
              <h2 className="font-semibold">Current conversation</h2>
              <div className="mt-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="border-b border-dashboard-border pb-4 last:border-0">
                    <p className="text-xs font-semibold text-dashboard-muted">{message.role === 'user' ? 'You' : 'Neurolearn'}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <History aria-hidden="true" className="mx-auto mb-3 h-7 w-7 text-dashboard-muted" />
              <h2 className="font-semibold">No messages in this session</h2>
              <p className="mt-2 text-sm text-dashboard-muted">Start a conversation to see your questions and responses here.</p>
            </div>
          )}
          <button type="button" onClick={onReturnToChat} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-dashboard-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-dashboard-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashboard-primary">
            Return to chat <ArrowRight aria-hidden="true" size={16} />
          </button>
        </div>
      </div>
    </main>
  );
});

AskHistoryView.displayName = 'AskHistoryView';
