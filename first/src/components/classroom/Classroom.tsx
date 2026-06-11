/**
 * Classroom.tsx
 * The main classroom component -- the heart of the AI Physics Teacher.
 * Acts as a layout shell coordinating visual containers.
 */

import Sidebar from './sidebar/Sidebar';
import MainStage from './stage/MainStage';
import { useClassroomSession } from '../../hooks/classroom/useClassroomSession';

export default function Classroom() {
  const session = useClassroomSession();

  return (
    <div
      className="flex h-[calc(100vh-80px)] rounded-3xl overflow-hidden border border-white/[0.07] shadow-2xl transition-all duration-700"
      style={{ background: 'linear-gradient(160deg,rgba(9,18,36,0.98) 0%,rgba(6,11,20,0.99) 100%)' }}
    >
      <Sidebar {...session} />

      <MainStage {...session} />
    </div>
  );
}
