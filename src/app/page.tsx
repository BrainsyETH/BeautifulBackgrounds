import Link from 'next/link';
import { Hero } from '@/components/hero';
import { StatsBar } from '@/components/stats-bar';
import { PhotoGrid } from '@/components/photo-grid';
import { getCurrentBackgrounds } from '@/lib/backgrounds';

export default function HomePage() {
  const featured = getCurrentBackgrounds().slice(0, 6);

  return (
    <>
      <Hero />
      <StatsBar />

      {/* Featured Backgrounds */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
              Featured Wallpapers
            </h2>
            <p className="mt-2 text-text-secondary">
              Currently in Brave&apos;s New Tab Page rotation
            </p>
          </div>
          <Link
            href="/gallery"
            className="text-sm text-brave-orange hover:text-brave-orange-hover"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="mt-8">
          <PhotoGrid backgrounds={featured} featured />
        </div>
      </section>

      {/* About blurb */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-bold text-text-primary">
            What is this?
          </h2>
          <p className="mt-4 text-text-secondary">
            Every time you open a new tab in Brave Browser, you see a stunning
            landscape photograph. These images are curated by Brave and
            delivered through a browser component — they&apos;re not ads,
            they&apos;re art. This site archives every wallpaper across all
            seasons, giving credit to the photographers behind them.
          </p>
          <Link
            href="/about"
            className="mt-4 inline-block text-sm text-brave-orange hover:text-brave-orange-hover"
          >
            Learn more &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
