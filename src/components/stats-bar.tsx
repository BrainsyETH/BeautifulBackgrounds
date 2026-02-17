import { getStats } from '@/lib/backgrounds';

export function StatsBar() {
  const stats = getStats();

  const items = [
    { label: 'Wallpapers', value: stats.totalWallpapers },
    { label: 'Photographers', value: stats.photographers },
  ];

  return (
    <section className="border-y border-border-subtle bg-bg-secondary/50">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-8 sm:px-6">
        {items.map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="font-heading text-3xl font-bold text-text-primary">
              {value}
            </p>
            <p className="mt-1 text-sm text-text-dim">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
