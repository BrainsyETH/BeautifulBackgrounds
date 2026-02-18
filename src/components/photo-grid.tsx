import type { Background } from '@/types';
import { PhotoCard } from './photo-card';

interface PhotoGridProps {
  backgrounds: Background[];
  featured?: boolean;
  varied?: boolean;
}

/**
 * Determine which card indices get a "tall" (row-span-2) or "wide" (col-span-2)
 * treatment. Uses a seeded pattern so the layout is stable across renders.
 */
function getVariedLayout(count: number): Map<number, 'wide' | 'tall'> {
  const layout = new Map<number, 'wide' | 'tall'>();
  if (count < 4) return layout;

  // First card is always wide (hero-style)
  layout.set(0, 'wide');

  // Then sprinkle tall/wide cards at intervals
  let next = 4;
  let toggle = false;
  while (next < count) {
    layout.set(next, toggle ? 'wide' : 'tall');
    toggle = !toggle;
    next += 3 + (next % 2); // vary the spacing: 3 or 4 apart
  }

  return layout;
}

export function PhotoGrid({ backgrounds, featured, varied }: PhotoGridProps) {
  if (backgrounds.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-dim">No wallpapers found.</p>
      </div>
    );
  }

  const variedLayout = varied ? getVariedLayout(backgrounds.length) : new Map();

  return (
    <div
      className={
        varied
          ? 'grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
      }
    >
      {backgrounds.map((bg, i) => {
        const variant = variedLayout.get(i);
        return (
          <PhotoCard
            key={bg.slug}
            background={bg}
            featured={featured && i === 0}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
