/**
 * Lighten or darken a hex color by a percentage.
 */
export function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Generate a slug from text.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Get the image path for a background.
 * Returns the local path if the image exists, or null for placeholder.
 */
export function getImagePath(filename: string): string {
  return `/backgrounds/${filename}`;
}

/**
 * Format a number with commas.
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}
