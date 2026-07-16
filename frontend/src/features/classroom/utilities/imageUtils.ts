// ─── Image URL helpers ────────────────────────────────────────────────────────

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'];

/**
 * Returns true if a string looks like an absolute image URL.
 * Used by Scene.tsx to decide whether to render ImageScene instead of a 3D scene.
 */
export function isImageUrl(str: string): boolean {
  try {
    const url = new URL(str);
    const pathname = url.pathname.toLowerCase();
    return IMAGE_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  } catch {
    // Not a valid URL
    const lower = str.toLowerCase();
    return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
  }
}

/**
 * Returns a safe image src — falls back to a placeholder if empty.
 */
export function safeImageSrc(url: string | undefined): string {
  if (!url || url.trim() === '') return '';
  return url;
}
