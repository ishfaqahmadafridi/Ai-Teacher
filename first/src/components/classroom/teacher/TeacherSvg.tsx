import type { TeacherSvgProps } from '../../../types/classroom/classroom.types';
import TeacherHead from './TeacherHead';
import TeacherBody from './TeacherBody';
import TeacherLeftArm from './TeacherLeftArm';
import TeacherRightArm from './TeacherRightArm';
import TeacherLegs from './TeacherLegs';

export default function TeacherSvg({
  bodyBob,
  armAngle,
  isWriting,
  isWalking,
  flip,
}: TeacherSvgProps) {
  return (
    <svg
      width="64"
      height="108"
      viewBox="0 0 64 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `scaleX(${flip})`,
        filter: 'drop-shadow(0 4px 12px rgba(59,130,246,0.4))',
      }}
    >
      {/* Shadow under feet */}
      <ellipse cx="32" cy="105" rx="14" ry="3" fill="rgba(0,0,0,0.3)" />

      {/* === BODY GROUP (bobs up/down) === */}
      <g transform={`translate(0, ${bodyBob})`}>
        {/* Head and Graduation Cap */}
        <TeacherHead />

        {/* Body / Suit jacket */}
        <TeacherBody />

        {/* LEFT arm (pointing arm -- raised for writing) */}
        <TeacherLeftArm armAngle={armAngle} isWriting={isWriting} />

        {/* RIGHT arm (at side / slightly gesturing) */}
        <TeacherRightArm />

        {/* Legs and Shoes */}
        <TeacherLegs isWalking={isWalking} />
      </g>
    </svg>
  );
}
