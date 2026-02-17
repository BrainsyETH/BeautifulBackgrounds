import type { Metadata } from 'next';
import Link from 'next/link';
import { getStats, getSeasons } from '@/lib/backgrounds';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About the Brave Backgrounds project — how NTP wallpapers are sourced and archived.',
};

export default function AboutPage() {
  const stats = getStats();
  const seasons = getSeasons();

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
        About
      </h1>

      <div className="mt-8 space-y-8 text-text-secondary">
        <div>
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            What are NTP Backgrounds?
          </h2>
          <p className="mt-3 leading-relaxed">
            Every time you open a new tab in{' '}
            <a
              href={siteConfig.links.brave}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brave-orange hover:text-brave-orange-hover"
            >
              Brave Browser
            </a>
            , you&apos;re greeted with a stunning landscape or nature
            photograph. These aren&apos;t ads — they&apos;re curated images
            delivered through Brave&apos;s &ldquo;NTP Background Images&rdquo;
            browser component, rotating seasonally with fresh photography.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            How is the data sourced?
          </h2>
          <p className="mt-3 leading-relaxed">
            The wallpaper metadata and images come from two places:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2 pl-2">
            <li>
              <strong className="text-text-primary">
                Brave&apos;s NTP component
              </strong>{' '}
              — The background images component delivered to every Brave browser
              contains a <code className="rounded bg-bg-card px-1 text-brave-orange">photo.json</code>{' '}
              file with metadata and the image files themselves.
            </li>
            <li>
              <strong className="text-text-primary">
                brave-core repository
              </strong>{' '}
              — Historical wallpaper data is preserved in the git history of
              Brave&apos;s open-source browser codebase.
            </li>
          </ul>
          <p className="mt-3 leading-relaxed">
            A weekly automated process checks for new wallpapers and updates
            this archive automatically.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            The Archive
          </h2>
          <p className="mt-3 leading-relaxed">
            We&apos;ve catalogued{' '}
            <strong className="text-text-primary">
              {stats.totalWallpapers} wallpapers
            </strong>{' '}
            from{' '}
            <strong className="text-text-primary">
              {stats.photographers} photographers
            </strong>{' '}
            across{' '}
            <strong className="text-text-primary">
              {stats.seasons} seasons
            </strong>{' '}
            since {stats.since}:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {seasons.map((season) => (
              <Link
                key={season}
                href={`/gallery?season=${encodeURIComponent(season)}`}
                className="rounded-full border border-border-subtle bg-bg-card px-3 py-1 text-sm text-text-primary transition-colors hover:border-brave-orange"
              >
                {season}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border-subtle bg-bg-card p-6">
          <h2 className="font-heading text-lg font-semibold text-text-primary">
            Disclaimer
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-dim">
            This site is <strong className="text-brave-orange">unofficial</strong> and
            is not affiliated with or endorsed by Brave Software, Inc. All
            photographs are the property of their respective photographers and
            are used according to their individual licenses. Brave and the Brave
            logo are trademarks of Brave Software, Inc.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <a
            href={siteConfig.links.brave}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border-subtle bg-bg-card px-4 py-2 text-sm text-text-primary transition-colors hover:border-brave-orange"
          >
            Brave Browser &rarr;
          </a>
          <a
            href={siteConfig.links.braveCore}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border-subtle bg-bg-card px-4 py-2 text-sm text-text-primary transition-colors hover:border-brave-orange"
          >
            brave-core Repo &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
