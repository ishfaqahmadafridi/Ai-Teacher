'use client';
import { memo } from 'react';
import { Sphere, Line } from '@react-three/drei';
import { ELECTRIC_DIPOLE, ELECTRIC_FIELD_LOOK as look } from '../../../constants/physicsSceneConstants';
import { useElectricFieldScene } from '../../../hooks/useElectricFieldScene';
import { DiagramLabel } from './DiagramLabel';
import { SceneTitle } from './SceneTitle';

const CHARGES = [
  { x: -ELECTRIC_DIPOLE.chargeX, ...look.positive },
  { x: ELECTRIC_DIPOLE.chargeX, ...look.negative },
];

export const ElectricFieldScene = memo(function ElectricFieldScene() {
  const { fieldLines } = useElectricFieldScene();

  return (
    <group>
      {/* Field Lines */}
      {fieldLines.map((points, idx) => (
        <Line key={idx} points={points} color={look.line.color} lineWidth={look.line.width} opacity={look.line.opacity} transparent />
      ))}

      {/* Positive and negative charges */}
      {CHARGES.map(charge => (
        <group key={charge.label}>
          <Sphere args={look.charge.args} position={[charge.x, 0, 0]}>
            <meshStandardMaterial color={charge.color} roughness={look.charge.roughness} />
          </Sphere>
          <DiagramLabel position={[charge.x, look.charge.labelOffsetY, 0]} fontSize={look.charge.labelFontSize} color={charge.labelColor} anchorX="center">
            {charge.label}
          </DiagramLabel>
        </group>
      ))}

      <SceneTitle>Electric Field Dipole Lines</SceneTitle>
    </group>
  );
});

ElectricFieldScene.displayName = 'ElectricFieldScene';
