'use client';
import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Group, Mesh, Vector3, type Material, type MeshStandardMaterial, type Object3D } from 'three';
import { ANATOMY_COLORS, ANATOMY_VIEW } from '../constants/anatomyVisualConstants';
import { anatomyPartForNames, applyAnatomyFocus } from '../utilities/anatomyParts';
import type { AnatomyModelProps, AnatomyPartMaterial } from '../types/visual.types';

function ancestorNames(node: Object3D): string[] {
  const names: string[] = [];
  for (let current: Object3D | null = node; current; current = current.parent) names.push(current.name);
  return names;
}

export function useAnatomyModel({ asset, partIds, focus }: AnatomyModelProps) {
  // Meshopt decodes in-browser without fetching a third-party Draco decoder.
  const { scene } = useGLTF(asset, false, true);
  const { model, materials } = useMemo(() => {
    const root = scene.clone(true);
    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    root.position.sub(box.getCenter(new Vector3()));
    const wrapper = new Group();
    wrapper.add(root);
    wrapper.scale.setScalar(ANATOMY_VIEW.fitSize / (Math.max(size.x, size.y, size.z) || 1));
    // Clone materials so highlighting never mutates the cached GLTF shared by other lessons.
    const owned: AnatomyPartMaterial[] = [];
    root.traverse(node => {
      if (!(node instanceof Mesh)) return;
      const source = node.material as Material;
      if (!('emissive' in source)) return;
      const material = source.clone() as MeshStandardMaterial;
      node.material = material;
      owned.push({ part: anatomyPartForNames(ancestorNames(node), partIds), material, baseColor: `#${material.color.getHexString()}` });
    });
    return { model: wrapper, materials: owned };
  }, [scene, partIds]);

  useEffect(() => {
    applyAnatomyFocus(materials, focus, ANATOMY_COLORS.focus, ANATOMY_COLORS.focusIntensity, ANATOMY_COLORS.noGlow);
  }, [materials, focus]);

  useEffect(() => () => { for (const { material } of materials) material.dispose(); }, [materials]);
  return model;
}
