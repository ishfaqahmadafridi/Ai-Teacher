import Image from 'next/image';
import Link from 'next/link';
import type { OnboardingHeaderProps } from '../types';

export function OnboardingHeader({
  className = '',
  logoHref = '/',
  showNav = true,
  showAction = true,
}: OnboardingHeaderProps) {
  return (
    <header className={`fixed top-0 w-full z-50 bg-[#0a0f1d]/60 backdrop-blur-[40px] saturate-[180%] border-b border-white/10 shadow-[0px_0px_20px_rgba(0,67,235,0.15)] ${className}`}>
      <div className="flex justify-between items-center px-4 md:px-10 py-3 max-w-[1280px] mx-auto">
        <Link href={logoHref} className="flex items-center gap-3 no-underline">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#0043eb] to-[#ddb7ff] p-[2px] shadow-[0_0_15px_rgba(0,67,235,0.5)]">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center">
              <Image
                src="/neurolearn-logo.png"
                alt="NeuroLearn Logo"
                width={26}
                height={26}
                className="object-contain drop-shadow-[0_0_8px_rgba(79,195,247,0.8)]"
                priority
              />
            </div>
          </div>
          <span className="font-extrabold tracking-[0.14em] uppercase text-white text-base font-['Montserrat',sans-serif]">
            NEUROLEARN
          </span>
        </Link>

        {/* Center Navigation Links */}
        {showNav && (
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/" className="text-[#c6c6cc] hover:text-white transition-colors no-underline">
              Curriculum
            </Link>
            <Link href="/" className="text-[#c6c6cc] hover:text-white transition-colors no-underline">
              Mentors
            </Link>
            <Link href="/" className="text-[#c6c6cc] hover:text-white transition-colors no-underline">
              Network
            </Link>
          </div>
        )}

        {/* Get Started Action */}
        {showAction && (
          <div>
            <Link
              href="/register"
              className="px-5 py-2 rounded-full bg-[#0043eb] hover:bg-[#1a58ff] text-white text-xs font-semibold tracking-wide shadow-[0_0_15px_rgba(0,67,235,0.6)] transition-all no-underline inline-block"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
