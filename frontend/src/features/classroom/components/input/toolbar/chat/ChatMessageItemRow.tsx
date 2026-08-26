'use client';

import { memo } from 'react';
import { User } from 'lucide-react';
import type { ChatMessageItemRowProps } from '../../../../types/input.types';

export const ChatMessageItemRow = memo(function ChatMessageItemRow({
  msg,
}: ChatMessageItemRowProps) {
  const isStudent = msg.role === 'student';
  const isTeacher = msg.role === 'teacher';

  return (
    <div
      className={`flex gap-2.5 items-start ${
        isStudent ? 'flex-row-reverse' : ''
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
          isTeacher ? 'bg-violet-600 text-white' : 'bg-sky-600 text-white'
        }`}
      >
        {isTeacher ? '✨' : <User className="w-3 h-3" />}
      </div>
      <div
        className={`max-w-[80%] rounded-xl p-2.5 text-xs font-sans ${
          isStudent
            ? 'bg-sky-600/25 border border-sky-500/40 text-sky-100'
            : 'bg-slate-800/90 border border-slate-700/80 text-slate-200'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold text-slate-300">
            {msg.sender}
          </span>
          <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
        </div>
        <p className="leading-relaxed">{msg.text}</p>
      </div>
    </div>
  );
});

ChatMessageItemRow.displayName = 'ChatMessageItemRow';
