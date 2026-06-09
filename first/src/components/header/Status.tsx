import React from 'react';

export default function Status() {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="hidden sm:inline">Prof. Gemini · online</span>
    </div>
  );
}
