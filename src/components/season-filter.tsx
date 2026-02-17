'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SeasonFilterProps {
  seasons: string[];
  activeSeason: string;
}

export function SeasonFilter({ seasons, activeSeason }: SeasonFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSelect(season: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (season === 'All') {
      params.delete('season');
    } else {
      params.set('season', season);
    }
    router.push(`/gallery?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {['All', ...seasons].map((season) => {
        const isActive = season === activeSeason;
        return (
          <button
            key={season}
            onClick={() => handleSelect(season)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-brave-orange text-white'
                : 'border border-border-subtle bg-bg-card text-text-secondary hover:border-brave-orange/50 hover:text-text-primary'
            }`}
          >
            {season}
          </button>
        );
      })}
    </div>
  );
}
