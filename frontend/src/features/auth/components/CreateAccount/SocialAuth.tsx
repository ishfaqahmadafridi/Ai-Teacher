'use client';

import type { SocialAuthProps } from '../../types';
import { Button } from '../ui/Button/Button';

export function SocialAuth({
  onGoogleClick,
  onMicrosoftClick,
  onAppleClick,
}: SocialAuthProps) {
  return (
    <div className="mt-8">
      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-grow" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <span
          className="text-[12px] font-medium leading-4 uppercase tracking-[0.1em]"
          style={{ color: 'rgba(198, 198, 204, 0.4)', fontFamily: 'Inter, sans-serif' }}
        >
          Or Sign Up With
        </span>
        <div className="h-px flex-grow" style={{ background: 'rgba(255,255,255,0.1)' }} />
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-3 gap-4">
        {/* Google */}
        <Button
          type="button"
          onClick={onGoogleClick}
          className="flex items-center justify-center gap-2.5 py-3 rounded-xl text-[#e5e2e3] text-[14px] font-semibold
                     bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20
                     transition-all duration-200 h-auto shadow-none"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <svg className="w-5 h-5 opacity-80" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </Button>

        {/* Microsoft */}
        <Button
          type="button"
          onClick={onMicrosoftClick}
          className="flex items-center justify-center gap-2.5 py-3 rounded-xl text-[#e5e2e3] text-[14px] font-semibold
                     bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20
                     transition-all duration-200 h-auto shadow-none"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <svg className="w-5 h-5 fill-current opacity-80" viewBox="0 0 24 24">
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
          </svg>
          Microsoft
        </Button>

        {/* Apple */}
        <Button
          type="button"
          onClick={onAppleClick}
          className="flex items-center justify-center gap-2.5 py-3 rounded-xl text-[#e5e2e3] text-[14px] font-semibold
                     bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20
                     transition-all duration-200 h-auto shadow-none"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <svg className="w-5 h-5 fill-current opacity-80" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05 1.61-3.14 1.61-1.03 0-1.63-.61-2.82-.61-1.2 0-1.85.59-2.76.61-1.12.02-2.13-.67-3.15-1.66-2.07-2.02-2.39-5.91-.72-8.31.84-1.2 1.94-1.92 3.12-1.92 1.13 0 1.83.61 2.8.61.94 0 1.58-.61 2.78-.61 1.09 0 2.05.62 2.76 1.54-2.45 1.25-2.05 4.54.41 5.64-.52 1.35-1.25 2.65-2.08 3.5zm-3.8-15.65c.96-1.15.82-2.35.71-2.92-1 .09-2.01.76-2.58 1.55-.54.76-.84 1.85-.69 2.85 1.05.07 1.88-.67 2.56-1.48z"/>
          </svg>
          Apple
        </Button>
      </div>
    </div>
  );
}
