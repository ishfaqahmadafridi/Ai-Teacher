import type { AuthHeaderProps } from '../../types';

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center mb-10">
      <h1
        className="mb-2 text-[32px] font-semibold leading-10 text-[#e5e2e3]"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="text-[16px] leading-6 font-normal"
          style={{ color: '#c6c6cc', fontFamily: 'Inter, sans-serif' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
