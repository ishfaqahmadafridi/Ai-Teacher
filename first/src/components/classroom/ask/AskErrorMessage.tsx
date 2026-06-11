import type { AskErrorMessageProps } from '../../../types/classroom/classroom.types';

export default function AskErrorMessage({ error }: AskErrorMessageProps) {
  if (!error) return null;
  return (
    <div className="flex justify-center">
      <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm max-w-lg text-center">
        <strong>⚠️ Error:</strong> {error}
      </div>
    </div>
  );
}
