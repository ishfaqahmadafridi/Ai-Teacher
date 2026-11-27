import type { AnatomyModelEntry, AnatomyModelId } from '../types/visual.types';

/**
 * Curated, medically sourced 3D models. Each GLB lives in public/ and its mesh
 * (or parent group) names start with the part IDs below. See docs/anatomy-3d-models.md.
 */
export const ANATOMY_ASSET_ROOT = '/classroom-assets/anatomy/3d';
export const ANATOMY_MODELS: Record<AnatomyModelId, AnatomyModelEntry> = {
  heart: {
    title: 'Human heart',
    asset: `${ANATOMY_ASSET_ROOT}/heart.glb`,
    parts: [
      { id: 'right_atrium', label: 'Right atrium' },
      { id: 'right_ventricle', label: 'Right ventricle' },
      { id: 'left_atrium', label: 'Left atrium' },
      { id: 'left_ventricle', label: 'Left ventricle' },
      { id: 'aorta', label: 'Aorta' },
      { id: 'pulmonary_trunk', label: 'Pulmonary trunk' },
      { id: 'superior_vena_cava', label: 'Superior vena cava' },
      { id: 'inferior_vena_cava', label: 'Inferior vena cava' },
    ],
  },
  brain: {
    title: 'Human brain',
    asset: `${ANATOMY_ASSET_ROOT}/brain.glb`,
    parts: [
      { id: 'frontal_lobe', label: 'Frontal lobe' },
      { id: 'parietal_lobe', label: 'Parietal lobe' },
      { id: 'temporal_lobe', label: 'Temporal lobe' },
      { id: 'occipital_lobe', label: 'Occipital lobe' },
      { id: 'cerebellum', label: 'Cerebellum' },
      { id: 'brainstem', label: 'Brainstem' },
      { id: 'midbrain', label: 'Midbrain' },
    ],
  },
  skeleton: {
    title: 'Human skeleton',
    asset: `${ANATOMY_ASSET_ROOT}/skeleton.glb`,
    parts: [
      { id: 'skull', label: 'Skull' },
      { id: 'spine', label: 'Vertebral column' },
      { id: 'rib_cage', label: 'Rib cage' },
      { id: 'pelvis', label: 'Pelvis' },
      { id: 'humerus', label: 'Humerus' },
      { id: 'femur', label: 'Femur' },
    ],
  },
};
export const ANATOMY_MODEL_IDS = Object.keys(ANATOMY_MODELS) as AnatomyModelId[];
export const ANATOMY_VIEW = {
  camera: [0, 0, 3.2] as [number, number, number], fov: 40, fitSize: 2, margin: 1.15, minDistance: 1.2, maxDistance: 8,
  ambientIntensity: 0.8, keyLightIntensity: 1.2,
};
export const ANATOMY_COLORS = { focus: '#f59e0b', focusIntensity: 0.35, noGlow: '#000000' };
export const ANATOMY_ATTRIBUTION = '3D anatomy: Z-Anatomy (CC BY-SA 4.0)';
export const ANATOMY_LOADING_TEXT = 'Loading 3D model…';
export const ANATOMY_MISSING_TEXT = '3D model not installed yet';
export const ANATOMY_PARTS_LABEL = 'Anatomy parts';
export const ANATOMY_CAPTION_SEPARATOR = ' · ';
/** Labelled 2D fallback grid used when WebGL or the model file is unavailable. */
export const ANATOMY_FALLBACK = { titleSuffix: '(2D fallback)', columns: 3, spacing: 0.5 };
/** The HEAD check result is stable for a session: model files are added by hand, not at runtime. */
export const ANATOMY_ASSET_QUERY_KEY = ['classroom', 'anatomy-asset'] as const;
