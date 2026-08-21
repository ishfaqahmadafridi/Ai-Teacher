'use client';

import { memo } from 'react';
import { AskMessageItem } from './AskMessageItem';
import { AskEmptyState } from './AskEmptyState';
import { AskTypingIndicator } from './AskTypingIndicator';
import type { AskMessageListProps } from '../../types/ask.types';

export const AskMessageList = memo(function AskMessageList({
  messages,
  loading,
  error,
  speakingId,
  onSpeak,
  messagesEndRef,
  className = '',
}: AskMessageListProps) {
  return (
    <main className={`flex-1 pt-24 pb-28 relative overflow-y-auto px-4 md:px-0 flex flex-col items-center custom-scrollbar ${className}`}>
      {messages.length === 0 ? (
        <AskEmptyState />
      ) : (
        <div className="w-full max-w-3xl flex-1 flex flex-col space-y-6 px-2">
          {messages.map((msg) => (
            <AskMessageItem
              key={msg.id}
              msg={msg}
              speakingId={speakingId}
              onSpeak={onSpeak}
            />
          ))}

          {/* Loading / Typing Indicator */}
          {loading && <AskTypingIndicator />}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </main>
  );
});

AskMessageList.displayName = 'AskMessageList';
