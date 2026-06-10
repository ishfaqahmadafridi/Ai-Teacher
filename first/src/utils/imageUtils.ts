export function isImageUrl(str?: string): boolean {
  if (!str) return false;
  return (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('/') ||
    /\.(jpg|jpeg|png|webp|gif|svg)/i.test(str)
  );
}

export function getRotationSpeed(action?: string, speed?: string): number {
  if (action !== 'rotate') return 0;
  return speed === 'fast' ? 0.02 : 0.005;
}

export function getZoomFactor(action?: string): number {
  if (action === 'zoom_in') return 1.4;
  if (action === 'zoom_out') return 0.7;
  if (action === 'zoom') return 1.2;
  return 1.0;
}

export function getFloatOffset(elapsedTime: number): number {
  return Math.sin(elapsedTime * 1.5) * 0.12;
}
