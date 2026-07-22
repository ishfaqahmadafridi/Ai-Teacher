import type { AuthErrorProps } from '../../types';

export function AuthError({ message }: AuthErrorProps) {
  if (!message) return null;
  return (
    <div
      className="mb-6 px-4 py-3 rounded-xl text-sm border"
      style={{
        background: 'rgba(255, 180, 171, 0.08)',
        borderColor: 'rgba(255, 180, 171, 0.25)',
        color: '#ffb4ab',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {message}
    </div>
  );
}
