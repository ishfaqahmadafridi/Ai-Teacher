'use client';
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from 'three';
import { fitDiagramCamera } from '../utilities/diagramCamera';

/** Refit on mount and whenever the panel is resized, so narrow layouts never crop labels. */
export function useDiagramCameraFit() {
  const camera = useThree(state => state.camera);
  const width = useThree(state => state.size.width);
  const height = useThree(state => state.size.height);
  useEffect(() => {
    if (camera instanceof PerspectiveCamera && width > 0 && height > 0) fitDiagramCamera(camera, width / height);
  }, [camera, width, height]);
}
