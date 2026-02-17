import type { Background } from '@/types';
import backgroundsData from '../../data/backgrounds.json';

const backgrounds: Background[] = backgroundsData as Background[];

export function getAllBackgrounds(): Background[] {
  return backgrounds.sort((a, b) => a.sort_order - b.sort_order);
}

export function getBackgroundBySlug(slug: string): Background | undefined {
  return backgrounds.find((bg) => bg.slug === slug);
}

export function getRelatedBackgrounds(
  slug: string,
  limit = 4
): Background[] {
  const current = getBackgroundBySlug(slug);
  if (!current) return [];

  const sameAuthor = backgrounds.filter(
    (bg) => bg.author === current.author && bg.slug !== slug
  );
  const sameSeason = backgrounds.filter(
    (bg) =>
      bg.season === current.season &&
      bg.slug !== slug &&
      bg.author !== current.author
  );

  return [...sameAuthor, ...sameSeason].slice(0, limit);
}

export function getStats() {
  const withImages = backgrounds.filter((bg) => bg.image_url !== null);
  const totalWallpapers = withImages.length;
  const photographers = new Set(withImages.map((bg) => bg.author)).size;
  return { totalWallpapers, photographers };
}
