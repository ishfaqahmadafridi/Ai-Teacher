'use client';

import { memo } from 'react';
import Image from 'next/image';
import { FormulaBlock } from '@/shared/components/FormulaBlock';
import { Button, Card } from '../ui';
import type { AskMessageItemProps } from '../../types/ask.types';

export const AskMessageItem = memo(function AskMessageItem({
  msg,
  speakingId,
  onSpeak,
  className = '',
}: AskMessageItemProps) {
  return (
    <div
      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-2 ${className}`}
    >
      {msg.role === 'user' ? (
        <Card className="max-w-[85%] p-4 rounded-2xl rounded-tr-none border border-dashboard-border bg-dashboard-selected text-dashboard-text shadow-md">
          <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
        </Card>
      ) : (
        <Card className="w-full max-w-[90%] p-6 rounded-2xl rounded-tl-none bg-dashboard-panel border border-dashboard-border relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="relative w-5 h-5 shrink-0">
                <Image
                  src="/neurolearn-brain-logo.png"
                  alt="NEUROLEARN Logo"
                  fill
                  sizes="20px"
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-semibold tracking-tight text-dashboard-text">NeuroLearn AI Tutor</span>
            </div>

            {/* Speaker button */}
            <Button
              type="button"
              onClick={() => onSpeak(msg.id, msg.content)}
              className={`p-1.5 rounded-lg transition-all ${
                speakingId === msg.id
                  ? 'bg-blue-500/20 text-dashboard-primary border border-dashboard-border animate-pulse'
                  : 'text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-subtle border-none bg-transparent cursor-pointer'
              }`}
              title={speakingId === msg.id ? 'Mute' : 'Speak'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
            </Button>
          </div>

          <div className="prose text-dashboard-text prose-sm leading-relaxed">
            <FormulaBlock>{msg.content}</FormulaBlock>
          </div>
        </Card>
      )}
      <span className="text-[10px] text-dashboard-muted uppercase tracking-widest font-mono pl-2 pr-2">
        {msg.role === 'user' ? 'Sent' : 'Generated'}
      </span>
    </div>
  );
});

AskMessageItem.displayName = 'AskMessageItem';
