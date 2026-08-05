import type { AuthHeaderProps } from '../../types';
import { LoginLogo } from '../Login/LoginLogo';

export function AuthHeader({
  title = 'Create Account',
  subtitle = 'Begin your high-tech gateway to the future of learning.',
}: AuthHeaderProps) {
  return (
    <div className="text-center mb-6">
      <LoginLogo />
      <h2 className="font-['Hanken_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold text-[#e1e2eb] mb-2 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#c4c5d9] text-sm font-['Inter',sans-serif]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

