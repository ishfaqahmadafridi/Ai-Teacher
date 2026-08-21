/**
 * Appends attachment metadata to input string if not already present.
 */
export function formatInputWithAttachment(input: string, fileName?: string): string {
  if (!fileName) return input.trim();
  const tag = `[Attached: ${fileName}]`;
  if (input.includes(tag)) return input.trim();
  return `${input.trim()} ${tag}`.trim();
}
