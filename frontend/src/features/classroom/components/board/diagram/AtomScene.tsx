import { memo } from 'react';
import { Sphere, Torus } from '@react-three/drei';
import { ATOM_ORBITS } from '../../../constants/boardConstants';
import { ATOM_LOOK as look } from '../../../constants/physicsSceneConstants';
import { useAtomScene } from '../../../hooks/useAtomScene';
import { DiagramLabel } from './DiagramLabel';
import { SceneTitle } from './SceneTitle';

const RING_ROTATION: [number, number, number] = [Math.PI / 2, 0, 0];

export const AtomScene = memo(function AtomScene() {
  const { electronRef } = useAtomScene();

  return (
    <group>
      {/* Nucleus */}
      <Sphere args={look.nucleus.args} position={[0, 0, 0]}>
        <meshStandardMaterial color={look.nucleus.color} emissive={look.nucleus.color} emissiveIntensity={look.nucleus.emissiveIntensity} />
      </Sphere>
      <DiagramLabel position={look.nucleusLabel.position} fontSize={look.nucleusLabel.fontSize} color={look.nucleusLabel.color} anchorX="left">
        Nucleus
      </DiagramLabel>

      {/* Orbital rings and electrons */}
      {ATOM_ORBITS.map(({ radius, color, electronColor }, i) => (
        <group key={i}>
          <Torus args={[radius, look.ring.tube, look.ring.radialSegments, look.ring.tubularSegments]} rotation={RING_ROTATION}>
            <meshStandardMaterial color={color} opacity={look.ring.opacity} transparent />
          </Torus>
          <Sphere ref={electronRef(i)} args={look.electron.args}>
            <meshStandardMaterial color={electronColor} emissive={electronColor} emissiveIntensity={look.electron.emissiveIntensity} />
          </Sphere>
        </group>
      ))}

      <SceneTitle>Atomic Structure — Electron Orbitals</SceneTitle>
    </group>
  );
});

AtomScene.displayName = 'AtomScene';
