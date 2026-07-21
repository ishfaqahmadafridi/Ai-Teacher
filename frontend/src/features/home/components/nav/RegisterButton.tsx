'use client';

import Link from 'next/link';

import type { RegisterButtonProps } from '../../types/nav_types';

export function RegisterButton({ className, onClick }: RegisterButtonProps) {
  return (
    <Link
      href="/register"
      id="navbar-register-btn"
      className={className || "hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm no-underline"}
      style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
        color: '#fff',
        boxShadow: '0 0 18px rgba(99, 102, 241, 0.35)',
        fontFamily: 'var(--font-outfit), sans-serif',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.6)';
        el.style.transform = 'translateY(-1px) scale(1.03)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.boxShadow = '0 0 18px rgba(99, 102, 241, 0.35)';
        el.style.transform = 'translateY(0) scale(1)';
      }}
    >
      Register
    </Link>
  );
}
