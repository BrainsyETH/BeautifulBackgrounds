import Link from 'next/link';
import Image from 'next/image';
import { adjustBrightness, getImagePath, safeColor } from '@/lib/utils';
import type { Background } from '@/types';

interface PhotoCardProps {
  background: Background;
  featured?: boolean;
}

export function PhotoCard({ background, featured }: PhotoCardProps) {
  const hasImage = background.image_url !== null;
  const imageSrc = hasImage
    ? getImagePath(background.filename)
    : null;

  return (
    <Link
      href={`/photo/${background.slug}`}
      className={`group relative block overflow-hidden rounded-xl border border-border-subtle bg-bg-card transition-all hover:-translate-y-0.5 hover:border-brave-orange/50 ${
        featured ? 'sm:col-span-2' : ''
      }`}
    >
      <div
        className={`relative w-full ${
          featured ? 'aspect-[21/9]' : 'aspect-[16/10]'
        }`}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${background.description} by ${background.author}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${safeColor(background.dominant_color)}, ${adjustBrightness(safeColor(background.dominant_color), 40)})`,
            }}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-white/20">
              {background.description}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Info on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-sm font-semibold text-white">
            {background.author}
          </p>
        </div>
      </div>
    </Link>
  );
}
