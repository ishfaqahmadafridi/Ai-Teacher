'use client';

import type { MethodSelectorProps } from '../../types';

export function MethodSelector({ method, onSelectMethod }: MethodSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {/* Email OTP Button */}
      <button
        type="button"
        onClick={() => onSelectMethod('email')}
        className={`p-8 rounded-xl flex flex-col items-center text-center group cursor-pointer transition-all duration-300 ${
          method === 'email'
            ? 'bg-[#0043eb]/15 border border-[#b8c3ff] shadow-[0_0_30px_rgba(0,67,235,0.3)]'
            : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(184,195,255,0.1)]'
        }`}
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
          method === 'email' ? 'bg-[#0043eb]/20' : 'bg-white/5'
        }`}>
          <svg className={`w-8 h-8 ${method === 'email' ? 'text-[#b8c3ff]' : 'text-slate-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </div>
        <span className="text-[14px] font-semibold tracking-[0.05em] text-[#e5e2e3] mb-1">
          Email OTP
        </span>
        <p className="text-sm text-[#c6c6cc]/60">Primary Method</p>
      </button>

      {/* SMS OTP Button */}
      <button
        type="button"
        onClick={() => onSelectMethod('sms')}
        className={`p-8 rounded-xl flex flex-col items-center text-center group cursor-pointer transition-all duration-300 ${
          method === 'sms'
            ? 'bg-[#0043eb]/15 border border-[#b8c3ff] shadow-[0_0_30px_rgba(0,67,235,0.3)]'
            : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(184,195,255,0.1)]'
        }`}
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
          method === 'sms' ? 'bg-[#0043eb]/20' : 'bg-white/5'
        }`}>
          <svg className={`w-8 h-8 ${method === 'sms' ? 'text-[#b8c3ff]' : 'text-slate-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <span className="text-[14px] font-semibold tracking-[0.05em] text-[#e5e2e3] mb-1">
          SMS OTP
        </span>
        <p className="text-sm text-[#c6c6cc]/60">Optional</p>
      </button>
    </div>
  );
}
