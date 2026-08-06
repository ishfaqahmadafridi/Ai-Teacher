import type { AskMessageItemProps } from '../types';
import { FormulaBlock } from '@/shared/components/FormulaBlock';
import { Button, Card } from './ui';

export function AskMessageItem({ msg, speakingId, onSpeak }: AskMessageItemProps) {
  return (
    <div
      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-2`}
    >
      {msg.role === 'user' ? (
        <Card className="max-w-[85%] p-4 rounded-2xl rounded-tr-none border border-white/10 bg-[#1c1b1d] text-slate-100 shadow-md">
          <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
        </Card>
      ) : (
        <Card className="w-full max-w-[90%] p-6 rounded-2xl rounded-tl-none glass-panel ai-glow relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="text-blue-400" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
              </svg>
              <span className="text-sm font-semibold tracking-tight gradient-text">NeuroLearn AI Tutor</span>
            </div>

            {/* Speaker button */}
            <Button
              onClick={() => onSpeak(msg.id, msg.content)}
              className={`p-1.5 rounded-lg transition-all ${
                speakingId === msg.id
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border-none bg-transparent cursor-pointer'
              }`}
              title={speakingId === msg.id ? 'Mute' : 'Speak'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
            </Button>
          </div>

          <div className="prose prose-invert prose-sm leading-relaxed">
            <FormulaBlock>{msg.content}</FormulaBlock>
          </div>
        </Card>
      )}
      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono pl-2 pr-2">
        {msg.role === 'user' ? 'Sent' : 'Generated'}
      </span>
    </div>
  );
}
