import type { AskMessageAvatarProps } from '../../../types/classroom/classroom.types';

export default function AskMessageAvatar({ role }: AskMessageAvatarProps) {
  return (
    <div
      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-md mt-1
      ${
        role === 'user'
          ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
          : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
      }`}
    >
      {role === 'user' ? 'Y' : 'P'}
    </div>
  );
}
