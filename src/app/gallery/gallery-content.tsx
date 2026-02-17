'use client';

import { useState } from 'react';
import { SeasonFilter } from '@/components/season-filter';
import { PhotoGrid } from '@/components/photo-grid';
import { PhotoLightbox } from '@/components/photo-lightbox';
import type { Background } from '@/types';

interface GalleryContentProps {
  backgrounds: Background[];
  seasons: string[];
  activeSeason: string;
}

export function GalleryContent({
  backgrounds,
  seasons,
  activeSeason,
}: GalleryContentProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mb-6">
        <SeasonFilter seasons={seasons} activeSeason={activeSeason} />
      </div>

      <div className="mb-4 text-sm text-text-dim">
        {backgrounds.length} wallpaper{backgrounds.length !== 1 ? 's' : ''}
      </div>

      <PhotoGrid backgrounds={backgrounds} featured={activeSeason === 'All'} />

      {lightboxIndex !== null && backgrounds[lightboxIndex] && (
        <PhotoLightbox
          background={backgrounds[lightboxIndex]}
          onClose={() => setLightboxIndex(null)}
          onPrev={
            lightboxIndex > 0
              ? () => setLightboxIndex(lightboxIndex - 1)
              : undefined
          }
          onNext={
            lightboxIndex < backgrounds.length - 1
              ? () => setLightboxIndex(lightboxIndex + 1)
              : undefined
          }
        />
      )}
    </>
  );
}
