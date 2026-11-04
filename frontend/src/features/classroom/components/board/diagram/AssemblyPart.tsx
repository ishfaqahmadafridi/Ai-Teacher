'use client';
import { memo } from 'react';
import { Html } from '@react-three/drei';
import { ASSEMBLY_VIEW, CONCEPTUAL_COLORS } from '../../../constants/conceptualVisualConstants';
import type { AssemblyPartProps } from '../../../types/visual.types';

export const AssemblyPart = memo(function AssemblyPart({ part, highlighted, showLabel }: AssemblyPartProps) {
  return <group position={part.position} rotation={part.rotation}>
    <mesh>
      {part.shape === 'box' && <boxGeometry args={part.size} />}
      {part.shape === 'sphere' && <sphereGeometry args={[part.size[0], ASSEMBLY_VIEW.segments, ASSEMBLY_VIEW.segments]} />}
      {part.shape === 'cylinder' && <cylinderGeometry args={[part.size[0], part.size[0], part.size[1], ASSEMBLY_VIEW.segments]} />}
      {part.shape === 'torus' && <torusGeometry args={[part.size[0], part.size[1], ASSEMBLY_VIEW.segments, ASSEMBLY_VIEW.segments, part.size[2] || Math.PI * 2]} />}
      <meshStandardMaterial color={highlighted ? CONCEPTUAL_COLORS.focus : part.color} emissive={highlighted ? CONCEPTUAL_COLORS.focus : part.color} emissiveIntensity={highlighted ? 0.3 : 0} />
    </mesh>
    {showLabel && <Html center position={[0, 0.5, 0]}><span className="pointer-events-none whitespace-nowrap rounded bg-dashboard-panel px-2 py-1 text-xs text-dashboard-text">{part.label}</span></Html>}
  </group>;
});
AssemblyPart.displayName = 'AssemblyPart';
