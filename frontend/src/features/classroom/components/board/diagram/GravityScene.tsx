import { memo } from 'react';
import { Sphere, Line } from '@react-three/drei';
import { FREE_FALL, GRAVITY_LOOK as look, SCENE_COLORS } from '../../../constants/physicsSceneConstants';
import { useGravityScene } from '../../../hooks/useGravityScene';
import type { GravitySceneProps } from '../../../types/board.types';
import { DiagramLabel } from './DiagramLabel';
import { SceneTitle } from './SceneTitle';

const { startY, groundY } = FREE_FALL;

export const GravityScene = memo(function GravityScene({ command }: GravitySceneProps) {
  const { ballRef, trailPoints, arrowArgs } = useGravityScene(command);

  return (
    <group>
      {/* Dotted trail */}
      <Line points={trailPoints} color={SCENE_COLORS.axis} lineWidth={1} dashed dashSize={0.15} gapSize={0.1} />

      {/* Falling ball */}
      <Sphere ref={ballRef} args={look.ball.args} position={[0, startY, 0]}>
        <meshStandardMaterial color={look.ball.color} roughness={look.ball.roughness} metalness={look.ball.metalness} />
      </Sphere>

      {/* Ground */}
      <Line points={[[-look.groundHalfWidth, groundY, 0], [look.groundHalfWidth, groundY, 0]]} color={SCENE_COLORS.ground} lineWidth={2} />

      {/* Labels */}
      <DiagramLabel position={[look.ballLabel.offsetX, startY, 0]} fontSize={look.ballLabel.fontSize} color={look.ballLabel.color} anchorX="left">
        Ball
      </DiagramLabel>
      <DiagramLabel position={look.groundLabel.position} fontSize={look.groundLabel.fontSize} color={SCENE_COLORS.muted} anchorX="left">
        Ground
      </DiagramLabel>
      <SceneTitle fontSize={FREE_FALL.titleFontSize}>Free Fall — F = mg</SceneTitle>

      {/* Gravity arrow */}
      <arrowHelper args={arrowArgs} />
    </group>
  );
});

GravityScene.displayName = 'GravityScene';
