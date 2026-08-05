import Image from 'next/image';
import type { LoginLogoProps } from '../../types';

export function LoginLogo({
  src = '/neurolearn-logo.png',
  alt = 'NeuroLearn Logo',
  className = '',
}: LoginLogoProps) {
  return (
    <div className={`flex justify-center items-center mb-6 ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={180}
        height={60}
        priority
        className="h-14 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(46,91,255,0.4)]"
      />
    </div>
  );
}
