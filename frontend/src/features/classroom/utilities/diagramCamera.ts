import { DIAGRAM_VIEW_BOUNDS } from '../constants/diagramConstants';

/** Camera distance at which the scene's labelled bounds fit both the panel's height and its width. */
export function diagramCameraDistance(verticalFovDegrees: number, aspect: number, bounds = DIAGRAM_VIEW_BOUNDS): number {
  const tanHalf = Math.tan((verticalFovDegrees * Math.PI) / 360);
  const safeAspect = Number.isFinite(aspect) && aspect > 0 ? aspect : 1;
  return Math.max(bounds.halfHeight / tanHalf, bounds.halfWidth / (tanHalf * safeAspect));
}

/** Move an orbiting camera back along its current direction to the fitted distance. */
export function fitDiagramCamera(camera: { fov: number; position: { setLength: (length: number) => unknown }; updateProjectionMatrix: () => void }, aspect: number) {
  camera.position.setLength(diagramCameraDistance(camera.fov, aspect));
  camera.updateProjectionMatrix();
}
