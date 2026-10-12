/** Bound screenshot size and skip empty WebGL scenes before uploading a PNG. */
import { LECTURE_FIGURE_MAX_DIMENSION, LECTURE_FIGURE_BACKGROUND } from '../constants/notesConstants';
export function captureLectureCanvas(canvas: HTMLCanvasElement): string | null {
  if (!canvas.width || !canvas.height) return null;
  const scale = Math.min(1, LECTURE_FIGURE_MAX_DIMENSION / Math.max(canvas.width, canvas.height));
  const snapshot = document.createElement('canvas');
  snapshot.width = Math.max(1, Math.round(canvas.width * scale));
  snapshot.height = Math.max(1, Math.round(canvas.height * scale));
  const context = snapshot.getContext('2d');
  if (!context) return null;
  context.drawImage(canvas, 0, 0, snapshot.width, snapshot.height);
  const pixels = context.getImageData(0, 0, snapshot.width, snapshot.height).data;
  let visible = false;
  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] > 0) { visible = true; break; }
  }
  if (!visible) return null;
  context.globalCompositeOperation = 'destination-over';
  context.fillStyle = LECTURE_FIGURE_BACKGROUND;
  context.fillRect(0, 0, snapshot.width, snapshot.height);
  return snapshot.toDataURL('image/png').split(',')[1];
}
