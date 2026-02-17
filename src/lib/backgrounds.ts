import type { Background } from '@/types';
import backgroundsData from '../../data/backgrounds.json';

const backgrounds: Background[] = backgroundsData as Background[];

export function getAllBackgrounds(): Background[] {
  return backgrounds.sort((a, b) => a.sort_order - b.sort_order);
}

export function getBackgroundsByseason(season: string): Background[] {
  if (!season || season === 'All') return getAllBackgrounds();
  return backgrounds
    .filter((bg) => bg.season === season)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getBackgroundBySlug(slug: string): Background | undefined {
  return backgrounds.find((bg) => bg.slug === slug);
}

export function getSeasons(): string[] {
  const seasons = Array.from(new Set(backgrounds.map((bg) => bg.season)));
  // Sort with most recent first
  const order = ['Spring 2024', 'Fall 2021', '2020/2021', 'Fall 2019'];
  return seasons.sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function getCurrentBackgrounds(): Background[] {
  return backgrounds
    .filter((bg) => bg.is_current)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getRelatedBackgrounds(
  slug: string,
  limit = 4
): Background[] {
  const current = getBackgroundBySlug(slug);
  if (!current) return [];

  // Same photographer first, then same season
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
