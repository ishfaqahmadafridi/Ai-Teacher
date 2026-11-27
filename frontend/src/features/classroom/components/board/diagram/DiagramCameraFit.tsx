'use client';
import { memo } from 'react';
import { useDiagramCameraFit } from '../../../hooks/useDiagramCameraFit';

/** Renders nothing; keeps the whole labelled scene inside the canvas. */
export const DiagramCameraFit = memo(function DiagramCameraFit() {
  useDiagramCameraFit();
  return null;
});
DiagramCameraFit.displayName = 'DiagramCameraFit';
