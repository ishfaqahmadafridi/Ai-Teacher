import type { ErrorBarProps } from '../../../types/classroom/classroom.types';

export default function ErrorBar({ error, setError }: ErrorBarProps) {
  if (!error) return null;

  return (
    <div className="flex-shrink-0 mx-4 mb-1 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-center gap-2">
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.834-1.732-.834-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      {error}
      <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-white">
        ✕
      </button>
    </div>
  );
}
