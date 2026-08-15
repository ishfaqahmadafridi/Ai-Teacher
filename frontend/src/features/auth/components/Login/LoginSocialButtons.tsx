'use client';

import { memo } from 'react';
import Link from 'next/link';

export const LoginSocialButtons = memo(function LoginSocialButtons() {
  return (
    <>
      {/* Create Account Link */}
      <p className="text-center text-[#64748b] text-sm mt-8">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#38bdf8] hover:text-[#7dd3fc] font-semibold transition-colors">
          Create Account
        </Link>
      </p>

      {/* Divider */}
      <div className="relative mt-8 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 text-[#64748b]" style={{ background: 'transparent' }}>
            Or sign in with
          </span>
        </div>
      </div>

      {/* Social Buttons Grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Google',
            icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
              </svg>
            ),
          },
          {
            label: 'Microsoft',
            icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#F35325" d="M11.4 11.4H0V0h11.4z" />
                <path fill="#81BC06" d="M24 11.4H12.6V0H24z" />
                <path fill="#05A6F0" d="M11.4 24H0V12.6h11.4z" />
                <path fill="#FFBA08" d="M24 24H12.6V12.6H24z" />
              </svg>
            ),
          },
          {
            label: 'Apple',
            icon: (
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
            ),
          },
        ].map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl py-3 text-white text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {icon}
            <span className="hidden sm:inline text-xs">{label}</span>
          </button>
        ))}
      </div>
    </>
  );
});

LoginSocialButtons.displayName = 'LoginSocialButtons';
