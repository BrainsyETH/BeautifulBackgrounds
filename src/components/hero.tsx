import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brave-orange/5 via-transparent to-transparent" />

      <div className="flex items-center gap-3">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl">
          Brave Backgrounds
        </h1>
      </div>

      <p className="mt-4 max-w-xl text-lg text-text-secondary sm:text-xl">
        An unofficial archive of the photography wallpapers from Brave
        Browser&apos;s New Tab Page
      </p>

      <div className="mt-2 inline-flex items-center gap-2">
        <span className="rounded-full border border-brave-orange px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brave-orange">
          Unofficial
        </span>
        <span className="text-sm text-text-dim">
          Not affiliated with Brave Software, Inc.
        </span>
      </div>

      <div className="mt-8">
        <Link
          href="/gallery"
          className="rounded-lg bg-brave-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brave-orange-hover"
        >
          Browse Gallery
        </Link>
      </div>
    </section>
  );
}
