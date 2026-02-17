import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllBackgrounds } from '@/lib/backgrounds';
import { GalleryContent } from './gallery-content';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse all New Tab Page photography wallpapers.',
};

export default async function GalleryPage() {
  const backgrounds = getAllBackgrounds().filter((bg) => bg.image_url !== null);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
          Gallery
        </h1>
        <p className="mt-2 text-text-secondary">
          All wallpapers
        </p>
      </div>

      <Suspense fallback={null}>
        <GalleryContent backgrounds={backgrounds} />
      </Suspense>
    </section>
  );
}
