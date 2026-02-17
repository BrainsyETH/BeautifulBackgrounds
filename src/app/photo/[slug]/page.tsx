import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  getBackgroundBySlug,
  getRelatedBackgrounds,
  getAllBackgrounds,
} from '@/lib/backgrounds';
import { adjustBrightness, getImagePath, safeColor, safeUrl } from '@/lib/utils';
import { PhotoGrid } from '@/components/photo-grid';

interface PhotoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PhotoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const photo = getBackgroundBySlug(slug);
  if (!photo) return { title: 'Not Found' };

  return {
    title: `${photo.author} — ${photo.description}`,
    description: `${photo.description} | Wallpaper by ${photo.author}`,
    openGraph: {
      images: photo.image_url
        ? [getImagePath(photo.filename)]
        : ['/og-image.png'],
    },
  };
}

export async function generateStaticParams() {
  return getAllBackgrounds().map((bg) => ({ slug: bg.slug }));
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { slug } = await params;
  const photo = getBackgroundBySlug(slug);

  if (!photo) notFound();

  const related = getRelatedBackgrounds(slug, 4);
  const hasImage = photo.image_url !== null;
  const imageSrc = hasImage ? getImagePath(photo.filename) : null;

  return (
    <div>
      {/* Hero image */}
      <div className="relative h-[50vh] w-full sm:h-[60vh] lg:h-[70vh]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${photo.description} by ${photo.author}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${safeColor(photo.dominant_color)}, ${adjustBrightness(safeColor(photo.dominant_color), 50)})`,
            }}
          >
            <span className="text-lg uppercase tracking-[0.3em] text-white/20">
              {photo.description}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
      </div>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="-mt-20 relative z-10 grid gap-8 lg:grid-cols-3">
          {/* Main info */}
          <div className="lg:col-span-2">
            <h1 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl">
              {photo.author}
            </h1>
            <p className="mt-2 text-lg text-text-secondary">
              {photo.description}
            </p>
          </div>

          {/* Metadata sidebar */}
          <div className="rounded-xl border border-border-subtle bg-bg-card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-dim">
              Details
            </h2>

            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-xs text-text-dim">Photographer</dt>
                <dd className="text-sm text-text-primary">{photo.author}</dd>
              </div>

              {safeUrl(photo.author_url) && (
                <div>
                  <dt className="text-xs text-text-dim">Portfolio</dt>
                  <dd>
                    <a
                      href={safeUrl(photo.author_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brave-orange hover:text-brave-orange-hover"
                    >
                      Visit &rarr;
                    </a>
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-xs text-text-dim">License</dt>
                <dd className="text-sm text-text-secondary">
                  {photo.license || 'Unknown'}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-text-dim">Filename</dt>
                <dd className="font-mono text-xs text-text-dim">
                  {photo.filename}
                </dd>
              </div>

              {photo.is_current && (
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brave-orange/10 px-2.5 py-1 text-xs font-medium text-brave-orange">
                    <span className="h-1.5 w-1.5 rounded-full bg-brave-orange" />
                    Currently in rotation
                  </span>
                </div>
              )}
            </dl>

            {imageSrc && (
              <a
                href={imageSrc}
                download
                className="mt-6 block w-full rounded-lg bg-brave-orange py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brave-orange-hover"
              >
                Download Image
              </a>
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8">
          <Link
            href="/gallery"
            className="text-sm text-text-dim hover:text-text-primary"
          >
            &larr; Back to Gallery
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pb-16">
            <h2 className="font-heading text-xl font-bold text-text-primary">
              Related Wallpapers
            </h2>
            <div className="mt-6">
              <PhotoGrid backgrounds={related} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
