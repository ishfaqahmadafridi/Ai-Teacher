'use client';
import { memo } from 'react';
import { useAnatomyModel } from '../../../hooks/useAnatomyModel';
import type { AnatomyModelProps } from '../../../types/visual.types';

export const AnatomyModel = memo(function AnatomyModel(props: AnatomyModelProps) {
  const model = useAnatomyModel(props);
  return <primitive object={model} />;
});
AnatomyModel.displayName = 'AnatomyModel';
