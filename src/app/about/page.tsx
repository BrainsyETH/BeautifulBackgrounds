import type { Metadata } from 'next';
import Link from 'next/link';
import { getStats } from '@/lib/backgrounds';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Beautiful Backgrounds — a curated gallery of browser New Tab Page photography.',
};

export default function AboutPage() {
  const stats = getStats();

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
        About
      </h1>

      <div className="mt-8 space-y-8 text-text-secondary">
        <div>
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            What is Beautiful Backgrounds?
          </h2>
          <p className="mt-3 leading-relaxed">
            Every time you open a new tab in Brave Browser, you&apos;re greeted
            with a stunning landscape or nature photograph. These are curated images delivered through the
            browser&apos;s background images component, rotating regularly with
            fresh photography from talented photographers around the world.
          </p>
          <p className="mt-3 leading-relaxed">
            Beautiful Backgrounds is a gallery that collects and showcases these
            wallpapers, giving proper credit to the photographers behind them.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            How is the data sourced?
          </h2>
          <p className="mt-3 leading-relaxed">
            The wallpaper images and metadata are extracted from Brave
            Browser&apos;s NTP Background Images component, which contains a
            metadata file alongside the image files themselves. An automated
            process checks for new wallpapers and updates this gallery.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            The Collection
          </h2>
          <p className="mt-3 leading-relaxed">
            We&apos;ve catalogued{' '}
            <strong className="text-text-primary">
              {stats.totalWallpapers} wallpapers
            </strong>{' '}
            from{' '}
            <strong className="text-text-primary">
              {stats.photographers} photographers
            </strong>
            . Browse them all in the{' '}
            <Link
              href="/gallery"
              className="text-brave-orange hover:text-brave-orange-hover"
            >
              Gallery
            </Link>
            .
          </p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-bg-card p-6">
          <h2 className="font-heading text-lg font-semibold text-text-primary">
            Unofficial Project
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-dim">
            This site is an unofficial project. It is not
          endorsed by, or in any way officially connected to
            Brave Software, Inc. The name &ldquo;Brave&rdquo; and any related
            trademarks are the property of Brave Software, Inc. All photographs
            are the property of their respective photographers and are used
            according to their individual licenses.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-dim">
            For more information, see our{' '}
            <Link
              href="/privacy"
              className="text-brave-orange hover:text-brave-orange-hover"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
