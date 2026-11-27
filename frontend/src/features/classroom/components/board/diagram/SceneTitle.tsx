'use client';
import { memo } from 'react';
import { SCENE_COLORS, SCENE_TITLE } from '../../../constants/physicsSceneConstants';
import type { SceneTitleProps } from '../../../types/board.types';
import { DiagramLabel } from './DiagramLabel';

/** Caption under every built-in scene, in one shared position, size and colour. */
export const SceneTitle = memo(function SceneTitle({ children, fontSize = SCENE_TITLE.fontSize }: SceneTitleProps) {
  return (
    <DiagramLabel position={SCENE_TITLE.position} fontSize={fontSize} color={SCENE_COLORS.title} anchorX="center">
      {children}
    </DiagramLabel>
  );
});
SceneTitle.displayName = 'SceneTitle';
