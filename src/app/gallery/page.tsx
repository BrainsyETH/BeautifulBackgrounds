import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getBackgroundsByseason, getSeasons } from '@/lib/backgrounds';
import { GalleryContent } from './gallery-content';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse all Brave Browser New Tab Page wallpapers by season.',
};

interface GalleryPageProps {
  searchParams: Promise<{ season?: string }>;
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = await searchParams;
  const activeSeason = params.season || 'All';
  const seasons = getSeasons();
  const backgrounds = getBackgroundsByseason(activeSeason);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
          Gallery
        </h1>
        <p className="mt-2 text-text-secondary">
          {activeSeason === 'All'
            ? 'All wallpapers across every season'
            : `Wallpapers from ${activeSeason}`}
        </p>
      </div>

      <Suspense fallback={null}>
        <GalleryContent
          backgrounds={backgrounds}
          seasons={seasons}
          activeSeason={activeSeason}
        />
      </Suspense>
    </section>
  );
}
