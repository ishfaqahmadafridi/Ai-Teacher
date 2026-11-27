import { memo } from 'react';
import { Line } from '@react-three/drei';
import { SCENE_COLORS, SCENE_TITLE, WAVE_LOOK as look } from '../../../constants/physicsSceneConstants';
import { useWaveScene } from '../../../hooks/useWaveScene';
import type { WaveSceneProps } from '../../../types/board.types';
import { DiagramLabel } from './DiagramLabel';

export const WaveScene = memo(function WaveScene(props: WaveSceneProps) {
  const { lineRef, initialPoints, axisPoints, color } = useWaveScene(props);

  return (
    <group>
      {/* Zero axis */}
      <Line points={axisPoints} color={SCENE_COLORS.axis} lineWidth={look.axisWidth} />
      {/* Animated wave */}
      <Line ref={lineRef} points={initialPoints} color={color} lineWidth={look.waveWidth} />

      <DiagramLabel position={look.titlePosition} fontSize={SCENE_TITLE.fontSize} color={SCENE_COLORS.title} anchorX="center">
        Wave Motion — y = A sin(kx − ωt)
      </DiagramLabel>
    </group>
  );
});

WaveScene.displayName = 'WaveScene';
