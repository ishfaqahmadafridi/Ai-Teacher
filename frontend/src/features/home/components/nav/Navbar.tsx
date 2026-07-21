'use client';

import { useState } from 'react';
import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { RegisterButton } from './RegisterButton';
import { MobileMenu } from './MobileMenu';

const NAV_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'AI Tools', href: '/aitool' },
  { label: 'FAQ', href: '/features#faq' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-3"
      style={{
        background: 'rgba(10, 16, 28, 0.72)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(99, 179, 237, 0.08)',
        animation: 'intro-fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
      }}
    >
      {/* ── Logo + Brand ── */}
      <Logo />

      {/* ── Desktop Nav Links ── */}
      <DesktopNav links={NAV_LINKS} />

      {/* ── Register Button & Hamburger ── */}
      <div className="flex items-center gap-4">
        <RegisterButton />

        {/* Mobile Hamburger toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1 cursor-pointer bg-transparent border-none outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 h-0.5 bg-blue-200 transition-all duration-300"
            style={{ transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }}
          />
          <span
            className="block w-5 h-0.5 bg-blue-200 transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-5 h-0.5 bg-blue-200 transition-all duration-300"
            style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }}
          />
        </button>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {menuOpen && <MobileMenu links={NAV_LINKS} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}

export default Navbar;
