import { memo } from 'react';
import { Sphere, Line } from '@react-three/drei';
import { PROJECTILE, PROJECTILE_LOOK as look, SCENE_COLORS } from '../../../constants/physicsSceneConstants';
import { useProjectileScene } from '../../../hooks/useProjectileScene';
import type { ProjectileSceneProps } from '../../../types/board.types';
import { DiagramLabel } from './DiagramLabel';
import { SceneTitle } from './SceneTitle';

const [LAUNCH_X, LAUNCH_Y] = PROJECTILE.origin;

export const ProjectileScene = memo(function ProjectileScene({ command }: ProjectileSceneProps) {
  const { ballRef, arcPoints, arrowArgs } = useProjectileScene(command);

  return (
    <group>
      {/* Arc path */}
      <Line points={arcPoints} color={look.arcColor} lineWidth={1.5} dashed dashSize={0.12} gapSize={0.08} />

      {/* Ball */}
      <Sphere ref={ballRef} args={look.ball.args} position={[LAUNCH_X, LAUNCH_Y, 0]}>
        <meshStandardMaterial color={look.ball.color} roughness={look.ball.roughness} />
      </Sphere>

      {/* Ground */}
      <Line points={[[-look.groundHalfWidth, LAUNCH_Y, 0], [look.groundHalfWidth, LAUNCH_Y, 0]]} color={SCENE_COLORS.ground} lineWidth={2} />

      {/* Velocity arrows at launch */}
      {arrowArgs.map((args, index) => <arrowHelper key={index} args={args} />)}

      {/* Labels */}
      <DiagramLabel position={look.componentLabelPosition} fontSize={look.labelFontSize} color={SCENE_COLORS.title} anchorX="center">
        v₀ₓ = v₀cos θ
      </DiagramLabel>
      <DiagramLabel position={look.equationLabelPosition} fontSize={look.labelFontSize} color={SCENE_COLORS.title} anchorX="center">
        y = v₀t·sin θ − ½gt²
      </DiagramLabel>
      <SceneTitle>Projectile Motion — θ = 45°</SceneTitle>
    </group>
  );
});

ProjectileScene.displayName = 'ProjectileScene';
