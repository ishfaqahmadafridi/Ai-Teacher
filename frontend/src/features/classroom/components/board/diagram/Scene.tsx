'use client';

import { memo } from 'react';
import { isImageUrl } from '@/utils/imageUtils';
import { GravityScene } from './GravityScene';
import { ProjectileScene } from './ProjectileScene';
import { WaveScene } from './WaveScene';
import { AtomScene } from './AtomScene';
import { ElectricFieldScene } from './ElectricFieldScene';
import { ImageScene } from './ImageScene';
import type { SceneProps } from '../../../types/board.types';

export const Scene = memo(function Scene({ type, command }: SceneProps) {
  // If the target is an image URL, always show ImageScene regardless of type
  if (command?.target && isImageUrl(command.target)) {
    return <ImageScene command={command} url={command.target} />;
  }

  switch (type) {
    case 'gravity':
      return <GravityScene command={command} />;
    case 'projectile':
      return <ProjectileScene command={command} />;
    case 'wave':
      return <WaveScene command={command} />;
    case 'atom':
      return <AtomScene />;
    case 'electric_field':
      return <ElectricFieldScene />;
    case 'image':
      return command?.target ? <ImageScene command={command} url={command.target} /> : null;
    default:
      return null;
  }
});

Scene.displayName = 'Scene';
