import type { LoginHeaderProps } from '../../types';
import { LoginLogo } from './LoginLogo';

export function LoginHeader({
  title = 'Welcome Back',
  subtitle = 'Sign in to continue your AI learning journey.',
}: LoginHeaderProps) {
  return (
    <div className="text-center mb-8">
      <LoginLogo />
      <h2 className="font-['Hanken_Grotesk',sans-serif] text-3xl sm:text-4xl font-bold text-[#e1e2eb] mb-2 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#c4c5d9] text-base font-['Inter',sans-serif]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
