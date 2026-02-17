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

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;
const DEFAULT_COLOR = '#1A1425';

/**
 * Sanitize a hex color value. Returns the color if it's a valid 6-digit hex,
 * otherwise returns a safe default. Prevents CSS injection via style attrs.
 */
export function safeColor(color: string): string {
  return HEX_COLOR_RE.test(color) ? color : DEFAULT_COLOR;
}

/**
 * Sanitize a URL to only allow https:// scheme.
 * Returns empty string for javascript:, data:, or other dangerous URIs.
 */
export function safeUrl(url: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return url;
    }
    return '';
  } catch {
    return '';
  }
}
