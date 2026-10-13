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


/** Render our inline SVG into PNG so exports reuse the demonstrated circuit. */
export async function captureLectureSvg(svg: SVGSVGElement): Promise<string | null> {
  const serialized = new XMLSerializer().serializeToString(svg);
  const url = URL.createObjectURL(new Blob([serialized], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Diagram snapshot unavailable'));
      image.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = svg.viewBox.baseVal.width;
    canvas.height = svg.viewBox.baseVal.height;
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.drawImage(image, 0, 0);
    return captureLectureCanvas(canvas);
  } finally { URL.revokeObjectURL(url); }
}

/** Capture same-origin educational images for the private lecture notes. */
export async function captureLectureImage(image: HTMLImageElement): Promise<string | null> {
  await image.decode();
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, LECTURE_FIGURE_MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
  canvas.width = Math.round(image.naturalWidth * scale);
  canvas.height = Math.round(image.naturalHeight * scale);
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return captureLectureCanvas(canvas);
}
