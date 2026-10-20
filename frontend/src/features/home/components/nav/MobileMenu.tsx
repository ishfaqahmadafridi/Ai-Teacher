'use client';

import { RegisterButton } from './RegisterButton';

import Link from 'next/link';
import type { MobileMenuProps } from '../../types/nav_types';

export function MobileMenu({ links, onClose }: MobileMenuProps) {
  return (
    <div
      className="absolute top-full left-0 right-0 flex flex-col gap-3 p-6 md:hidden animate-[intro-fadeInUp_0.3s_ease-out]"
      style={{
        background: 'var(--color-dashboard-panel)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--color-dashboard-border)',
      }}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-dashboard-muted text-sm font-medium hover:text-dashboard-text transition-colors no-underline py-1"
          onClick={onClose}
        >
          {link.label}
        </Link>
      ))}
      <RegisterButton
        className="mt-2 inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold text-sm no-underline"
        onClick={onClose}
      />
    </div>
  );
}
