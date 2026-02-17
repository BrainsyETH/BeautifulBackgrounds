import type { Background } from '@/types';
import { PhotoCard } from './photo-card';

interface PhotoGridProps {
  backgrounds: Background[];
  featured?: boolean;
}

export function PhotoGrid({ backgrounds, featured }: PhotoGridProps) {
  if (backgrounds.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-dim">No wallpapers found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {backgrounds.map((bg, i) => (
        <PhotoCard
          key={bg.slug}
          background={bg}
          featured={featured && i === 0}
        />
      ))}
    </div>
  );
}
